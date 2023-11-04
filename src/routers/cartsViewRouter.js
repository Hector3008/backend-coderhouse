import { Router } from "express";
import { handlePolicies as hp } from "../../utils.js";
import { cartViewController as cartV } from "../controllers/carts.controller.js";

const cartsViewsRouter = Router();

cartsViewsRouter.get("/", async (req, res) => {
  res.render("notYet.handlebars");
});

cartsViewsRouter.get("/:cid", hp(["user", "admin"]), cartV);

export default cartsViewsRouter;
