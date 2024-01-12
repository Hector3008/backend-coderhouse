import { Router } from "express";
import {
  registerController as register,
  loginController as login,
  logoutController as logout,
  githubLoginController as github,
  githubcallbackController as githubcallback,
  profileController as profile,
  updateToPremiumController as updateToPremium,
  postToCPSController as postToCPS,
  CPSVerifyCodeController as CPSVerifyCode,
  resetPasswordController as resetPassword,
  deleteUserController as deleteUser,
  userByEmailController as userByEmail,
} from "../controllers/sessions.controller.js";
import ps from "passport";
import { handlePolicies as hp } from "../../utils.js";

const sessionsRouter = Router();

sessionsRouter.post(  "/register",  ps.authenticate("register", { failureRedirect: "/error" }), register
);

sessionsRouter.post(  "/login",  ps.authenticate("login", { failureRedirect: "/error" }),  login
);

sessionsRouter.get("/logout", logout);

sessionsRouter.get("/github", github);

sessionsRouter.get("/githubcallback", githubcallback);
sessionsRouter.get("/profile/:uid",profile)
sessionsRouter.get("/user/email/:email",userByEmail)

sessionsRouter.delete("/delete/:email", deleteUser);

sessionsRouter.get("/premium/:uid", hp(["user", "premium"]), updateToPremium);

sessionsRouter.post("/forget-password", postToCPS)
sessionsRouter.get("/CPS/verify-code/:code", CPSVerifyCode)
sessionsRouter.post("/reset-password/:email/code/:code", resetPassword);

export default sessionsRouter;
