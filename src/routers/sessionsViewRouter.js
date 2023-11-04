import { Router } from "express";
import { handlePolicies as hp } from "../../utils.js";
import {
  registerController as register,
  loginController as login,
  profileController as profile,
} from "../controllers/sessions.controller.js";

const sessionsViewsRouter = Router();

sessionsViewsRouter.get("/register", hp("public"), register);

sessionsViewsRouter.get("/", hp("public"), login);

sessionsViewsRouter.get("/profile", hp(["user", "admin"]), profile);

export default sessionsViewsRouter;
