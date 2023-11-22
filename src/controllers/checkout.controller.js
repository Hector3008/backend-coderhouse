import nodemailer from "nodemailer";
import cfg from "../config/config.js";
import Mailgen from "mailgen";

const getbill = (req, res) => {
  const destinatario = "hectorh3008@gmail.com";
  const numeroPedido = "123";
  let config = {
    service: "gmail",
    auth: {
      user: cfg.NODEMAILER_USER,
      pass: cfg.NODEMAILER_PASS,
    },
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
    from: "Dpto Ventas - Coder Shop <ecommerce@ecommerce.com>",
    to: destinatario,
    subject: `Compra ${numeroPedido} realizada con éxito`,
    html: mail,
  };
  transporter
    .sendMail(message)
    .then(() => {
      return res.status(200).json({ message: "Yo have received an email" });
    })
    .catch((err) => res.status(500).json({ err }));
};

export default getbill;
