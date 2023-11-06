import { Router } from "express";
import {
  registerController as register,
  loginController as login,
  logoutController as logout,
  githubLoginController as github,
  githubcallbackController as githubcallback,

} from "../controllers/sessions.controller.js";
import passport from "passport";

const ps = passport
const sessionsRouter = Router();

sessionsRouter.post(  "/register",  ps.authenticate("register", { failureRedirect: "/error" }), register
);

sessionsRouter.post(  "/login",  ps.authenticate("login", { failureRedirect: "/error" }),  login
);

sessionsRouter.get("/logout", logout);

sessionsRouter.get("/github", github);

sessionsRouter.get("/githubcallback", githubcallback);

export default sessionsRouter;
