import { Router } from "express"
import userModel from "../../dao/models/users.model.js";

const sessionsRouter = Router()

sessionsRouter.get("/", async (req,res)=>{
  res.send("sessionsRouter gotten");
})

sessionsRouter.post("/register", async (req, res) => {
  console.log("Recibiendo solicitud POST en /api/sessions/register");
  const newUser = req.body;

  const user = await userModel.create(newUser);
  const SEO = {}
  res.redirect('/products', {SEO: SEO})
});

sessionsRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email, password }).lean().exec();
  


  if (!user) {
    return res.send("usuario no encontrado");
  }
  if (
    user.email === "adminCoder@coder.com" &&
    user.password === "adminCod3r123"
  ) {
    user.role = "admin";
  } else {
    user.role = "user";
  }

  req.session.user = user

  res.redirect("/products");
});

sessionsRouter.get("/logout", (req, res) => {
  
   req.session.destroy(err => {
       if (err) return res.send('Logout error')
       return res.redirect('/sessions')
      }) 
   } )



export default sessionsRouter