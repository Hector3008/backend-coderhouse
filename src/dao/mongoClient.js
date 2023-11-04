import mongoose from "mongoose";
import cfg from "../config/config.js";

/*consulta al tutor: 
//deseo instanciar una vde compuesta de otras vde, pero no sé cómo declararla aún.
*/
    const MONGO_URI = `mongodb+srv://${cfg.MONGO_DB_ADMIN_NAME}:${cfg.MONGO_DB_CLOUD_ADMIN_DB}@e-comerce.bpmaosh.mongodb.net/`;
    /* ejemplo:
    const variable = process.env.MONGO_URI;
    console.log(MONGO_URI);
    console.log(variable);
    */

export default class mongoClient {
  constructor(){
    this.connected = true,
    this.client = mongoose
  }
  
  connect = async () => {
    try {
      await this.client.connect(MONGO_URI, {
        dbName: cfg.MONGO_DB_NAME,
        useUnifiedTopology: true,
      })
      console.log("mongo connection success!");

    } catch (error) {
      console.log("mongo connection failure!");
    }
  }
}