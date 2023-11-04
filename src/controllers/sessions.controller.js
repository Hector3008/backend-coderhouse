export const registerController = async (req, res) => {
  const SEO = { title: "registro" };
  res.render("sessions/register.handlebars", { SEO });
};
export const loginController = async (req, res) => {
  const SEO = { title: "login" };
  res.render("sessions/login.handlebars", { SEO });
};

export const profileController = async (req, res) => {
  res.render("sessions/profile.handlebars", req.session.user);
};