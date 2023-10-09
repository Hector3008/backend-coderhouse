import { Router } from "express";
import { getProductsFromCart } from "../controllers/cartsController.js";
import { adminRouter } from "../middlewares/auth.middleware.js";

const cartsViewsRouter = Router();

cartsViewsRouter.get("/", adminRouter, async (req, res) => {
  res.render("notYet.handlebars");
});

cartsViewsRouter.get("/:cid", adminRouter, async (req, res) => {
  const id = req.params.cid;
  const result = await getProductsFromCart(req, res);

  const SEO = {
    title: `cart: ${id}`,
  };

  if (result.statusCode === 200) {
    res.render("productsFromCart.handlebars", {
      cart: result.response.payload,
      SEO: SEO,
    });
  } else {
    res
      .status(result.statusCode)
      .json({ status: "error", error: result.response.error });
  }
});

export default cartsViewsRouter;
