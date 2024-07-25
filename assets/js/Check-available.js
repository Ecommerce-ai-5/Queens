async function checkAvailability() {
  // Load the cart from local storage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    // console.log("Cart is empty.");
    return;
  }

  try {
    // Fetch product data from Firebase
    const response = await fetch(
      "https://store-f9c5e-default-rtdb.firebaseio.com/queens/Products.json"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch product data from Firebase");
    }
    const productsData = await response.json();

    // Initialize flag for out-of-stock items and items with insufficient quantity
    let outOfStockItems = [];
    let insufficientQuantityItems = [];

    // Create a map to count the quantities of items in the cart
    let cartQuantities = {};
    cart.forEach((item) => {
      const key = `${item.id}-${item.productSize}-${item.productColor}`;
      cartQuantities[key] = (cartQuantities[key] || 0) + 1;
    });

    // Check each item in the cart
    cart.forEach((cartItem, index) => {
      let productAvailable = false;
      let hasSufficientQuantity = false;

      for (const key in productsData) {
        const product = productsData[key];
        if (
          product["product-title"] === cartItem.title &&
          product.sizes[cartItem.productSize] &&
          product.sizes[cartItem.productSize][cartItem.productColor]
        ) {
          const productInfo =
            product.sizes[cartItem.productSize][cartItem.productColor];
          if (productInfo.qty > 0) {
            productAvailable = true;
            if (
              cartQuantities[
                `${cartItem.id}-${cartItem.productSize}-${cartItem.productColor}`
              ] <= productInfo.qty
            ) {
              hasSufficientQuantity = true;
            }
          }
        }
      }

      if (!productAvailable) {
        // Add the out-of-stock item to the list
        outOfStockItems.push(cartItem.title);
        // Remove the item from the cart
        cart.splice(index, 1);
      } else if (!hasSufficientQuantity) {
        // Add the item with insufficient quantity to the list
        insufficientQuantityItems.push(cartItem.title);
        // Reduce the quantity of this item in the cart to match the database quantity
        cartQuantities[
          `${cartItem.id}-${cartItem.productSize}-${cartItem.productColor}`
        ]--;
        cart.splice(index, 1);
      }
    });

    // Update the cart in local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Show an alert if there were any out-of-stock or insufficient quantity items
    if (outOfStockItems.length > 0 || insufficientQuantityItems.length > 0) {
      let message = "";
      if (outOfStockItems.length > 0) {
        message += `The following items are out of stock and have been removed from your cart: ${outOfStockItems.join(
          ", "
        )}. `;
      }
      if (insufficientQuantityItems.length > 0) {
        message += `The following items had insufficient quantities and have been adjusted in your cart: ${insufficientQuantityItems.join(
          ", "
        )}.`;
      }
      Swal.fire({
        icon: "warning",
        title: "Cart Update",
        text: message,
      }).then(() => {
        location.reload();
      });
    } else {
      // Swal.fire({
      //   icon: "success",
      //   title: "All items are available",
      //   text: "All items in your cart are available.",
      // });
    }
  } catch (error) {
    console.error("Error checking availability:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "There was an error checking the availability of the items. Please try again later.",
    });
  }
}
