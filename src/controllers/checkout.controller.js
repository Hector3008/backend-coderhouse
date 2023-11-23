import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import cfg from "../config/config.js";

const getBill = async (req, res) => {
  try {
    const destinatario = "hectorh3008@gmail.com";

    // Use environment variables for better security
    const emailUser = cfg.NODEMAILER_EMAIL;
    const emailPassword = cfg.NODEMAILER_PASSWORD;

    let config = {
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
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
    console.error("error from catch on checkoutController: ", error);
    res.status(500).json({
      message: "Error al enviar el correo",
    });
  }
};

export default getBill;
