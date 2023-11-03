import { Router } from "express";
import { handlePolicies } from "../../utils.js";
const sessionsViewsRouter = Router();

sessionsViewsRouter.get("/register", handlePolicies("public"), async (req, res) => {
  const SEO = {title: "registro"}
  res.render("sessions/register.handlebars", {SEO});
});

sessionsViewsRouter.get("/", handlePolicies("public"), (req, res) => {
  const SEO = { title: "login" };
  res.render("sessions/login.handlebars", { SEO });
});

sessionsViewsRouter.get("/profile", handlePolicies(["user", "admin"]), (req, res) => {
  res.render("sessions/profile.handlebars", req.session.user);
});

export default sessionsViewsRouter;
