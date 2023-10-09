import { Router } from "express";
import { publicRoutes, privateRoutes } from "../middlewares/auth.middleware.js";

const sessionsViewsRouter = Router();

sessionsViewsRouter.get("/register", publicRoutes, async (req, res) => {
  res.render("sessions/register.handlebars");
});

sessionsViewsRouter.get("/", publicRoutes, (req, res) => {
  res.render("sessions/login.handlebars");
});

sessionsViewsRouter.get("/profile", privateRoutes, (req, res) => {
  res.render("sessions/profile.handlebars", req.session.user);
});

export default sessionsViewsRouter;
