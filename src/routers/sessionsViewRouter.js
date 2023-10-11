import { Router } from "express";
import { publicRoutes, privateRoutes } from "../middlewares/auth.middleware.js";

const sessionsViewsRouter = Router();

sessionsViewsRouter.get("/register", publicRoutes, async (req, res) => {
  const SEO = {title: "registro"}
  res.render("sessions/register.handlebars", {SEO});
});

sessionsViewsRouter.get("/", publicRoutes, (req, res) => {
  const SEO = {title: "login"}
  res.render("sessions/login.handlebars", {SEO});
});

sessionsViewsRouter.get("/profile", privateRoutes, (req, res) => {
  res.render("sessions/profile.handlebars", req.session.user);
});

export default sessionsViewsRouter;
