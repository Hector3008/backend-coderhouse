export const publicRoutes = (req, res, next) => {
  if (req.session.user)
    return res.send(
      "esta ruta es pública, no puedes acceder si estás logueado"
    );
  next();
};
;
export const privateRoutes = (req, res, next) => {
  if (!req.session.user)
    return res.send("esta ruta es privada, debes loguearte para acceder");
  next();
};

export const adminRouter = (req,res,next)=> {

  console.log("adminRouter middleware iniciado!");
  console.log("req.session.role:",req.session.user.role);
  console.log("req.session.user.first_name:", req.session.user.first_name);
  console.log("req.session.user:", req.session.user);
  console.log(
    "req.session.user.role === 'admin': ",
    req.session.user.role === "admin"
  );

  const condition = req.session.user.role === "admin"

  console.log(condition);
  ;
  if (!condition) {console.log("res.send('res.send del if')"); return res.render('error.handlebars', {user: req.session.user})} 
  next();
}
