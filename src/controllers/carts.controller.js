import { getProductsFromCart } from "../services/carts.services.js"

export const cartController = async (req, res) => {
  const id = req.params.cid;
  const result = await getProductsFromCart(req, res);
  console.log(result);

  const SEO = {
    title: `cart: ${id}`,
  };
  console.log(result.statusCode);
  console.log("result.response.payload", result.response.payload);
  if (result.statusCode == "200") {
    res.render("productsFromCart.handlebars", {
      cart: result.response.payload._id,
      products: result.response.payload.products,
      SEO: SEO,
    });
  } else {
    res
      .status(result.statusCode)
      .json({ status: "error", error: result.response.error });
  }
};