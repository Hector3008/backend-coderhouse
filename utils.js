import bcrypt from "bcrypt";

//helper function para encriptar contraseñas: 
export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))

//helper function para validar la contraseña de un login:
export const isValidPassword = (user, password)=> bcrypt.compareSync(password,user.password)

//helper function para la política de autorización en vistas según roles de sesión:
export const handlePolicies = policies => (req,res,next)=> {
  const user = req.session.user || null

  if(policies==="public"){
    if (user) return res.status(400).render("error.handlebars", { error: "not auth" })
    return next();
  } 
  try {
      if (!policies.includes(user.role))
        return res
          .status(403)
          .render("error.handlebars", { error: "not auth" });
      return next();
  } catch (err) {
    return res.status(403).send("error.handlebars", { error: err });
  }

}