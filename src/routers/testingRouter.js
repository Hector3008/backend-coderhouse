import { Router } from "express";
import mailer from "../config/mailer.config.js";

const testingRouter = Router();

/*
this is an example of body to mailer ↓↓↓ */
const bod = {
    intro: "Hola, esto es un correo de prueba",
    table: {
      data: [
        {
          item: "Producto 1",
          descripcion: "Descripcion del producto 1",
          price: "100",
          quantity: "1",
          total: "100",
        },
      ],
    },
    outro: "Gracias por su compra", 
};
testingRouter.get("/nodemailer", async (req, res)=>{
  await mailer(
    "hectorh3008@gmail.com",
    bod,
    "Coder Shop <EMAIL>",
    "Pedido Coder Shop"
  );
  if(!mailer) return res.status(500).json({status:"error", message: "mail does not send successfully"})
  res.status(200).json({status: "success", message:"mail sends successfully"})
 })

export default testingRouter