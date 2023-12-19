import { Router } from "express";
import cfg from "../config/config.js";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";

const testingRouter = Router();

/* importante: 
nodemailer funciona en mi entorno virtual de git codespaces pero no en mi entorno personal. Esto, porque en el entorno personal me arroja un error de credenciales por una configuración de mi node o vsc que aún no entiendo. Ya probé cambiando la versión de node y sigue ocurriendo lo mismo
 */
testingRouter.get("/nodemailer", async (req, res)=>{
  //console.log("testing Router Nodemailer initialized");
  try {
    const destinatario = "hectorhosep3008@gmail.com";

    // Use environment variables for better security
    const emailUser = cfg.NODEMAILER_EMAIL;
    const emailPassword = cfg.NODEMAILER_PASSWORD;

    let config = {
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
      tls: { rejectUnauthorized: false },
    };

    let transporter = nodemailer.createTransport(config);
    let Mailgenerator = new Mailgen({
      theme: "default",
      product: {
        name: "PixelLend",
        link: "http://www.PixelLend.com",
      },
    });

    let response = {
      body: {
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
      },
    };

    let mail = Mailgenerator.generate(response);

    let message = {
      from: "Coder Shop <EMAIL>",
      to: destinatario,
      subject: "Pedido Coder Shop",
      html: mail,
    };

    // Use async/await for sending emails
    await transporter.sendMail(message);

    res.status(200).json({
      message: "Correo enviado",
    });
  } catch (error) {
    console.error("error from catch on testingRouter: ", error);
    res.status(500).json({
      message: "Error al enviar el correo",
      error: error,
    });
  }
res.send("testing Router Nodemailer initialized")
})

export default testingRouter