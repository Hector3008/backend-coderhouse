import Router from "express";
import { sendSMS } from "../controllers/twilio.controller.js";

const twilioRouter = Router();

twilioRouter.post("/", sendSMS);

export default twilioRouter;
