import mongoose from "mongoose";
import cfg from "../config/config.js";


export default class mongoClient {
  constructor(){
    this.connected = true,
    this.client = mongoose
  }
  
  connect = async () => {
    try {
      await this.client.connect(cfg.MONGO_URI, {
        dbName: cfg.MONGO_DB_NAME,
        useUnifiedTopology: true,
      })
      console.log("mongo connection success!");

    } catch (error) {
      console.log("mongo connection failure!");
    }
  }
}