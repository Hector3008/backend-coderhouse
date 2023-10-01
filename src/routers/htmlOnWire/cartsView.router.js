import { Router } from "express";
import getProductsFromCart from "../../controllers/getProductsFromCart.js";

/* FS manner:
//import ProductManager from "../dao/fsManagers/productManager.js";
//const productManager = new ProductManager("./data/products.json");
*/

const cartsViewsRouter = Router();

cartsViewsRouter.get('/', async (req, res)=>{
  res.render('notYet.handlebars')
})
cartsViewsRouter.get("/:cid", async (req, res) => {
  const result = await getProductsFromCart(req, res);

  if (result.statusCode === 200) {
    res.render("productsFromCart.handlebars", {
      cart: result.response.payload,
    });
  } else {
    res
      .status(result.statusCode)
      .json({ status: "error", error: result.response.error });
  }
});

export default cartsViewsRouter;