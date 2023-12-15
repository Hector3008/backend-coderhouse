import { Router } from "express";
import {
  registerController as register,
  loginController as login,
  logoutController as logout,
  githubLoginController as github,
  githubcallbackController as githubcallback,
  profileController as profile,
  updateToPremiumController as updateToPremium

} from "../controllers/sessions.controller.js";
import ps from "passport";

const sessionsRouter = Router();

sessionsRouter.post(  "/register",  ps.authenticate("register", { failureRedirect: "/error" }), register
);

sessionsRouter.post(  "/login",  ps.authenticate("login", { failureRedirect: "/error" }),  login
);

sessionsRouter.get("/logout", logout);

sessionsRouter.get("/github", github);

sessionsRouter.get("/githubcallback", githubcallback);
sessionsRouter.get("/profile/:uid",profile)

sessionsRouter.get("/premium/:uid", updateToPremium);

export default sessionsRouter;
