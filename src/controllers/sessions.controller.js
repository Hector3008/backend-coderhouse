import passport from "passport";
import cfg from "../config/config.js";

export const registerViewController = async (req, res) => {
  const SEO = { title: "registro" };
  res.render("sessions/register.handlebars", { SEO });
};
export const loginViewController = async (req, res) => {
  const SEO = { title: "login" };
  res.render("sessions/login.handlebars", { SEO });
};

export const profileViewController = async (req, res) => {
  res.render("sessions/profile.handlebars", req.session.user);
};

export const registerController = async (req, res) => {
  res.redirect("/sessions")
}

export const loginController =  async (req, res) => {
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
  };


export const logoutController = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send("Logout error");
    return res.redirect("/sessions");
  });
};

export const githubLoginController = ()=> {
  passport.authenticate("github", { scope: ["user:email"] }), (req, res) => {};
}

export const githubcallbackController = ()=> {
  passport.authenticate("github", { failureRedirect: "/login" }),
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

}