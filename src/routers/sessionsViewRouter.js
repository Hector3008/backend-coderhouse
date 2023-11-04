import { Router } from "express";
import { handlePolicies as hp } from "../../utils.js";
import {
  registerController,
  loginController,
  profileController,
} from "../controllers/sessions.controller.js";

const sessionsViewsRouter = Router();

sessionsViewsRouter.get("/register", hp("public"), registerController);

sessionsViewsRouter.get("/", hp("public"), loginController);

sessionsViewsRouter.get("/profile", hp(["user", "admin"]), profileController);

export default sessionsViewsRouter;
