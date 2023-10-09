import { Router } from "express";
import passport from "passport";

const sessionsRouter = Router();

sessionsRouter.get("/", async (req, res) => {
  res.send("sessionsRouter gotten");
});

sessionsRouter.post("/register", passport.authenticate('register', {failureRedirect: '/error'}), async (req, res) => {
  res.redirect("/sessions");
});

sessionsRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/error" }),
  async (req, res) => {
    if (!req.user) {
      return res
        .status(400)
        .send({ status: "error", error: "Invalid credentials" });
    }
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
    };
    if (req.user.email === "adminCoder@coder.com") {req.session.user.role = 'admin'} else {req.session.user.role = 'user'}
    res.redirect("/products");
  }
);

sessionsRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send("Logout error");
    return res.redirect("/sessions");
  });
});

export default sessionsRouter;
