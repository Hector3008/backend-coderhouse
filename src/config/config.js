import dotenv from "dotenv";
import program from "./commands.js";

dotenv.config()
const opts = program.opts();
const MONGO_URI = `mongodb+srv://${process.env.MONGO_DB_ADMIN_NAME}:${process.env.MONGO_DB_CLOUD_ADMIN_DB}@e-comerce.bpmaosh.mongodb.net/`;

export default {
  PORT: opts.Port || process.env.PORT,
  MONGO_DB_ADMIN_NAME: opts.Mongo_db_name || process.env.MONGO_DB_ADMIN_NAME,
  MONGO_DB_CLOUD_ADMIN_DB:
    opts.Mongo_db_cloud_admin_db || process.env.MONGO_DB_CLOUD_ADMIN_DB,
  MONGO_DB_NAME: opts.Mongo_db_name || process.env.MONGO_DB_NAME,
  ADMIN_EMAIL: opts.Admin_email || process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: opts.Admin_password || process.env.ADMIN_PASSWORD,
  MONGO_URI: opts.Mongo_url || MONGO_URI,
  SESSION_SIGN: opts.Session_sign || process.env.SESSION_SIGN,

  PERSISTENCE: opts.Persistence || process.env.PERSISTENCE,
  NODEMAILER_EMAIL: opts.Nodemailer_email || process.env.NODEMAILER_EMAIL,
  NODEMAILER_PASSWORD:
    opts.Nodemailer_password || process.env.NODEMAILER_PASSWORD,
  TWILIO_ACCOUNT_SID: opts.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: opts.TWILIO_AUTH_TOKEN || process.env.TWILIO_AUTH_TOKEN,
  TWILIO_AUTH_TLF: opts.TWILIO_AUTH_TLF||process.env.TWILIO_AUTH_TLF
};

