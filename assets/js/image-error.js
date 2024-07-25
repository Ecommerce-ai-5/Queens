// Function to set default image source if the image source is null or empty
function setDefaultImageSource(product) {
  const defaultSrc =
    "https://i.imgur.com/gLKw3OD_d.webp?maxwidth=760&fidelity=grand";

  if (
    !product["product-photo"] ||
    product["product-photo"].trim() === "" ||
    product["product-photo"] === "undefined"
  ) {
    product["product-photo"] = defaultSrc;
  }

  if (
    !product["product-photo2"] ||
    product["product-photo2"].trim() === "" ||
    product["product-photo2"] === "undefined"
  ) {
    product["product-photo2"] = defaultSrc;
  }
}

// Function to set default image source if the image source is null or empty in product details
function setDefaultImageSource_PD(product, img1Key, img2Key) {
  const defaultSrc =
    "https://i.imgur.com/gLKw3OD_d.webp?maxwidth=760&fidelity=grand";

  if (
    !product[img1Key] ||
    product[img1Key].trim() === "" ||
    product[img1Key] === "undefined"
  ) {
    product[img1Key] = defaultSrc;
  }

  if (
    !product[img2Key] ||
    product[img2Key].trim() === "" ||
    product[img2Key] === "undefined"
  ) {
    product[img2Key] = defaultSrc;
  }
}