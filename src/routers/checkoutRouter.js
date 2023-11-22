import Router from "express";
import getbill from "../controllers/checkout.controller.js";

const checkoutRouter = Router();

checkoutRouter.post("/", getbill);

export default checkoutRouter;
