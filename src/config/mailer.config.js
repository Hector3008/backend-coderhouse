import cfg from "./config.js";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";

export default async (addresser, body, from, subject) => {
  try {
    const address = addresser;

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
      body: body,
    };

    let mail = await Mailgenerator.generate(response);

    let message = {
      from: from,
      to: address,
      subject: subject,
      html: mail,
    };

    // Use async/await for sending emails
    await transporter.sendMail(message);
    return true;
    
  } catch (error) {
    return false;
  }
};
