import Router from "express";
import {
  successController as success,
  cancelController as cancel,
  createStripeSession as stripe,
  viewController as view,
} from "../controllers/checkout.controller.js";
import { handlePolicies as hp } from "../../utils.js";

const checkoutRouter = Router();

checkoutRouter.get("/success/:oid", hp(["user", "premium", "admin"]), success);
checkoutRouter.get("/cancel/:oid", hp(["user", "premium", "admin"]), cancel);
checkoutRouter.post("/stripe", hp(["user", "premium", "admin"]), stripe);
checkoutRouter.get("/view", hp(["user", "premium", "admin"]), view);

export default checkoutRouter;
