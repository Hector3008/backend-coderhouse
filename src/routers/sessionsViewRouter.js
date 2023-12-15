import { Router } from "express";
import { handlePolicies as hp } from "../../utils.js";
import {
  registerViewController as register,
  loginViewController as login,
  profileViewController as profile,
  forgetPasswordViewController as forgetPassword,
} from "../controllers/sessions.controller.js";

const sessionsViewsRouter = Router();

sessionsViewsRouter.get("/register", hp("public"), register);

sessionsViewsRouter.get("/", hp("public"), login);

sessionsViewsRouter.get("/profile", hp(["user", "admin"]), profile);

sessionsViewsRouter.get("/forget-password", forgetPassword);

sessionsViewsRouter.get("/reset-password/:token", (req, res) => {
  res.redirect(`/api/sessions/verify-token/${req.params.token}`);
});

export default sessionsViewsRouter;
