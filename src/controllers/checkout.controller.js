import nodemailer from "nodemailer";
import cfg from "../config/config.js";
import Mailgen from "mailgen";

const getbill = async (req, res) => {
  try {
    const destinatario = "hectorh3008@gmail.com";
    const numeroPedido = "123";
    let config = {
      service: "gmail",
      auth: {
        user: cfg.NODEMAILER_EMAIL,
        pass: cfg.NODEMAILER_PASSWORD,
      },
      secure: false, // Disable certificate validation (for development only)
      
    };

    let transporter = nodemailer.createTransport(config);

    let Mailgenerator = new Mailgen({
      theme: "default",
      product: {
        name: "ecommerce",
        link: "http://www.ecommerce.com",
      },
    });

    let response = {
      body: {
        intro: "Your bill has arrived!",
        table: {
          data: [
            {
              item: "Notebook",
              description: "A simple notebook",
              price: "$1900",
            },
          ],
        },
        outro: "Looking forward to do more business",
      },
    };

    let mail = Mailgenerator.generate(response);

    let message = {
      from: "ecommerce <ecommerce@ecommerce.com>",
      to: destinatario,
      subject: `Compra ${numeroPedido} realizada con éxito`,
      html: mail,
    };

    await transporter.sendMail(message)
  
  res.status(200).json({ message: "Yo have received an email" })
    
  } catch (error) {
    console.error("error: ", error);
    res.status(500).json({
      message: "Error al enviar el correo",
    });
  }
};

export default getbill;

