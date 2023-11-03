import bcrypt from "bcrypt";

//helper function 
export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))

//helper function
export const isValidPassword = (user, password)=> bcrypt.compareSync(password,user.password)

export const handlePolicies = policies => (req,res,next)=> {
  const user = req.session.user || null

  if(policies==="public"){
    if (user) return res.status(400).render("error.handlebars", { error: "not auth" })
    return next();
  } 

  console.log(user.role);
  if (!policies.includes(user.role)) return res.status(403).render("error.handlebars", { error: "not auth" });
  return next()
}