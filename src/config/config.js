import dotenv from "dotenv";
import program from "./commands.js";

dotenv.config()

const MONGO_URI = `mongodb+srv://${process.env.MONGO_DB_ADMIN_NAME}:${process.env.MONGO_DB_CLOUD_ADMIN_DB}@e-comerce.bpmaosh.mongodb.net/`;

export default {
  PORT: program.opts().port || process.env.PORT,
  MONGO_DB_ADMIN_NAME:
    program.opts().mongo_db_name || process.env.MONGO_DB_ADMIN_NAME,
  MONGO_DB_CLOUD_ADMIN_DB:
    program.opts().mongo_db_cloud_admin_db || process.env.MONGO_DB_CLOUD_ADMIN_DB,
  MONGO_DB_NAME: program.opts().mongo_db_name || process.env.MONGO_DB_NAME,
  ADMIN_EMAIL: program.opts().admin_email || process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: program.opts().admin_password || process.env.ADMIN_PASSWORD,
  MONGO_URI: program.opts().mongo_url || MONGO_URI,
  SESSION_SIGN: program.opts().session_sign || process.env.SESSION_SIGN,

  PERSISTENCE: program.opts().persistence || process.env.PERSISTENCE,
};