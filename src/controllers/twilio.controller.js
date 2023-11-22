
import twilio from "twilio";
import cfg from "../config/config.js";

export const sendSMS = (req, res) => {
  const accountSid = cfg.TWILIO_ACCOUNT_SID;
  const authToken = cfg.TWILIO_AUTH_TOKEN;

  const client = twilio(accountSid, authToken);

  client.messages
    .create({
      body: "This is the ship that made the Kessel Run in fourteen parsecs?",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "+51942270712",
    })
    .then((message) => res.send(message))
    .catch((err) => res.send("error on twilio: ", err));
    
};
