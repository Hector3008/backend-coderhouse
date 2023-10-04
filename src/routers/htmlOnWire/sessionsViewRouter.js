import { Router } from "express";

const sessionsViewsRouter = Router();

sessionsViewsRouter.get("/register", async (req, res) => {
  const user= {
    username: 'hector',
    role: 'user'
  } 
  res.cookie('user',JSON.stringify(user))
  res.render("sessions/register.handlebars");
});

sessionsViewsRouter.get("/", (req, res) => {
  res.render("sessions/login.handlebars");
});

sessionsViewsRouter.get("/profile", (req, res) => {
  if (req.cookies.user){
  res.render("sessions/profile.handlebars")
  } else {
    res.render("error.handlebars")
  }
});

export default sessionsViewsRouter;
