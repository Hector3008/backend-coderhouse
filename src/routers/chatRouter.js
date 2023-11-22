import { Router } from "express";
import { handlePolicies as hp } from "../../utils.js";
const chatRouter = Router();

chatRouter.get("/", hp(["user"]), (req, res) => {
  res.render("chat.handlebars", { user: req.session.user.email });
});

export default chatRouter;
