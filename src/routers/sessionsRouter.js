import { Router } from "express";
import {
  registerController as register,
  loginController as login,
  logoutController as logout,
  githubLoginController as github,
  githubcallbackController as githubcallback,
} from "../controllers/sessions.controller.js";
import passport from "passport";
import cfg from "../config/config.js";

const sessionsRouter = Router();

sessionsRouter.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/error" }),
  async (req, res) => {
    res.redirect("/sessions");
  }
);

sessionsRouter.post("/login",passport.authenticate("login", { failureRedirect: "/error" }),
  async (req, res) => {
    if (!req.user) {
      return resz
        .status(400)
        .send({ status: "error", error: "Invalid credentials" });
    }
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      cart: req.user.cart,
      role: req.user.role,
    };
    if (req.user.email === cfg.ADMIN_EMAIL) {
      req.session.user.role = "admin";
    } else {
      req.session.user.role = "user";
    }
    res.redirect("/products");
  }
);

sessionsRouter.get("/logout", logout);

sessionsRouter.get("/github", github);

sessionsRouter.get("/githubcallback", githubcallback);

export default sessionsRouter;
