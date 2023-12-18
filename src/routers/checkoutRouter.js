import Router from "express";
import getbill from "../controllers/checkout.controller.js";
import { handlePolicies as hp } from "../../utils.js";
const checkoutRouter = Router();

checkoutRouter.post("/", hp(["admin", "premium", "user"]), getbill);

export default checkoutRouter;
