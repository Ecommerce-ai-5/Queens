$(document).ready(function () {
  // Store the original order of the products
  const originalProducts = $(".product-list").html();

  $("#sortSelect").change(function () {
    const sortBy = $("#sortSelect").val();

    if (sortBy === "newest") {
      location.reload();
    } else {
      showPreloader();
      setTimeout(() => {
        sortProducts();
        hidePreloader();
      }, 500); // Adjust the timeout as needed
    }
  });

  function sortProducts() {
    const sortBy = $("#sortSelect").val();

    const $products = $(".product-list .product-card");

    $products.sort(function (a, b) {
      const priceA = parseFloat(
        $(a).find(".card-price").text().replace(" EGP", "")
      );
      const priceB = parseFloat(
        $(b).find(".card-price").text().replace(" EGP", "")
      );

      if (sortBy === "price-low-high") {
        return priceA - priceB;
      } else if (sortBy === "price-high-low") {
        return priceB - priceA;
      } else {
        return 0; // Default to no sorting
      }
    });

    $(".product-list").html($products);
  }
});
