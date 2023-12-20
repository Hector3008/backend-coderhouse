import ps from "passport";
import nodemailer from 'nodemailer';
import UserDTO from "../dto/users.dto.js";
import { UserService, CPSService } from "../services/services.js";
import { generateRandomCode, isValidPassword } from "../../utils.js";
import { createHash } from "../../utils.js";
import cfg from "../config/config.js";

export const registerViewController = async (req, res) => {
  const SEO = { title: "registro" };
  res.render("sessions/register.handlebars",  {SEO} );
};
export const loginViewController = async (req, res) => {
 const SEO = { title: "login" };
  res.render("sessions/login.handlebars", {SEO});
};
export const profileViewController = async (req, res) => {
  res.render("sessions/profile.handlebars", req.session.user);
};
////////////////////////////////////////////////////////////////////////
export const forgetPasswordViewController = async (req, res) => {
  res.render("sessions/forget-password.handlebars");
};
export const resetPasswordCodeController = async (req, res) => {
  res.redirect(`/api/sessions/verify-code/${req.params.code}`);
};

export const postToCPSController = async(req,res)=>{
  const email = req.body.email;

  const user = await UserService.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }
  const code = generateRandomCode()

  await CPSService.create({ email, code });

  const mailerConfig = {
    service: "gmail",
    auth: { user: cfg.NODEMAILER_EMAIL, pass: cfg.NODEMAILER_PASSWORD },
    tls: { rejectUnauthorized: false },
  };
let transporter = nodemailer.createTransport(mailerConfig)
let message = {
  from: cfg.NODEMAILER_EMAIL,
  to: email,
  subject: "[ecommerce] Reset your password",
  html: `<h1>[Coder e-comm API] Reset your password</h1><hr />You have asked to reset your password. You can do it here: <a href="http://${req.hostname}:${cfg.PORT}/api/sessions/CPS/verify-code/${code}">http://${req.hostname}:${cfg.PORT}/api/sessions/CPS/verify-code/${code}</a><hr />Best regards,<br><strong>e-commerce team</strong>`,
};
try {
    await transporter.sendMail(message)
    return res.json({ status: 'success', message: `Email successfully sent to ${email} in order to reset password` })
} catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
}
}

export const CPSVerifyCodeController = async(req,res)=>{
  const code = req.params.code
  const search = await CPSService.findOne({ code: code });
  if (!search)
  return res
    .status(404)
    .redirect("/sessions/forget-password");
  if (search.isUsed)return res.status(404).json({status:"error", error:"código ya usado"})
  
  const user = search.email
  console.log("json: ", {
    message: "CPSVerifyCodeController initialized",
    code: code,
    search: search,
    user: user,
  });
    res
      .render("sessions/reset-password.handlebars",{user: user, code: code});
}
export const resetPasswordController = async(req, res)=> {
  try {
    const code = req.params.code;
    const email = req.params.email;
    const user = await UserService.findOne({email: email})
    
    const isSamePassword = isValidPassword(user, req.body.newPassword);
    if(isSamePassword) return res.status(404).redirect("/sessions/forgot-password")
    
    const newPassword = createHash(req.body.newPassword);
    await UserService.update(user._id, {
              password: newPassword
            });
    const CPS = await CPSService.findOne({code: code})
    CPS.isUsed = true
    await CPSService.update(CPS._id, CPS)
    res.json({
      message: "request success! password changed all right",
    });
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
  
}
////////////////////////////////////////////////////////////////////////
export const profileController = async (req, res) => {
  const uid = req.params.uid;
  const result = await UserService.getById(uid);
  const dtoresult = new UserDTO(result);
  res.status(202).json({ status: "success", payload: dtoresult });
};
export const registerController = async (req, res) => {
  res.redirect("/sessions");
};
export const loginController =  async (req, res) => {

    if (!req.user) {
      return res
        .status(505)
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

    res.redirect("/products");
  };
export const logoutController = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send("Logout error");
    return res.redirect("/sessions");
  });
};
export const githubLoginController = () => {
  ps.authenticate("github", { scope: ["user:email"] }), (req, res) => {};
};
export const githubcallbackController = () => {
  ps.authenticate("github", { failureRedirect: "/login" }),
    async (req, res) => {
      //console.log("Callback: ", req.user);
      req.session.user = req.user;

      if (req.user.email === "adminCoder@coder.com") {
        req.session.user.role = "admin";
      } else {
        req.session.user.role = "user";
      }

      res.redirect("/products");
    };
};
export const updateToPremiumController = async (req, res) => {
  
  try {
    const user = await UserService.getById(req.params.uid)
    let updatedUser

    switch (user.role) {
      case "user":
        user.role = "premium";
         updatedUser = await UserService.update(req.params.uid, user);
        break;
      case "premium":
        user.role = "user";
         updatedUser = await UserService.update(req.params.uid, user);
        break;
      default:
        break;
    }
    res.json({
      status: "success",
      message: "Se ha actualizado el rol del usuario",
    });
  } catch (err) {
    console.log("catch initialized");
    res.json({ status: "error", error: err.message });
  }
};