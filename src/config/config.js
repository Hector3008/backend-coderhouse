import dotenv from "dotenv";

dotenv.config()

export default {
  PORT: process.env.PORT,
  MONGO_DB_ADMIN_NAME: process.env.MONGO_DB_ADMIN_NAME,
  MONGO_DB_CLOUD_ADMIN_DB: process.env.MONGO_DB_CLOUD_ADMIN_DB,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  MONGO_URI: process.env.MONGO_URI,
  SESSION_SIGN: process.env.SESSION_SIGN,
};