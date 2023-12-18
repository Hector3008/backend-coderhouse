import { Router } from "express";
import { handlePolicies as hp } from "../../utils.js";
import {
  registerViewController as register,
  loginViewController as login,
  profileViewController as profile,
  forgetPasswordViewController as forgetPassword,
  resetPasswordCodeController as resetPasswordCode
} from "../controllers/sessions.controller.js";

const sessionsViewsRouter = Router();

sessionsViewsRouter.get("/register", hp("public"), register);

sessionsViewsRouter.get("/", hp("public"), login);

sessionsViewsRouter.get("/profile", hp(["user", "admin"]), profile);

sessionsViewsRouter.get("/forget-password", forgetPassword);

sessionsViewsRouter.get("/reset-password/:code", resetPasswordCode);

export default sessionsViewsRouter;
