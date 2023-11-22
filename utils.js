import bcrypt from "bcrypt";
import EErros from "./src/services/errors/enums.js";
/*
para encriptar contraseñas: */
export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))

/*
para validar la contraseña de un login: */
export const isValidPassword = (user, password)=> bcrypt.compareSync(password,user.password)

/*
para la política de autorización en vistas según roles de sesión:*/
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

export const generateRandomCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
};



export const errorHandler = async (error, req, res, next) => {
  console.log("error.cause: ", error.cause);
  switch (error.code) {
    case EErros.TITLE_FIELD_EMPTY:
      res.status(400).send({ status: "error", error: error.name });
      break;
    default:
      res.send({ status: "error", error: "Unhandled error" });
      break;
  }
};