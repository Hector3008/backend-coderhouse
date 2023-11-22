import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import cfg from "./config/config.js";
import cookieParser from "cookie-parser";
import ps from "passport";
import initializePassport from "./config/passport.config.js";
import cors from "cors"
import mongoClient from "./dao/mongoClient.js";
import compression from "express-compression";
import { errorHandler } from "../utils.js";

export default  (app) => {
  try {
    console.log("engineer up!");
    /*
    cors es para que se puedan conectar a la app desde varios dominios:
    */
    app.use(cors());
    /*
    para gestionar la información en sesiones:
    */
    app.use(session({
        secret: cfg.SESSION_SIGN,
        resave: true,
        saveUninitialized: true,
      })
    );

    /*
  //ingeniería de passport:
  */
    initializePassport();
    app.use(ps.initialize());
    app.use(ps.session());

    /*
  (ingeniería json)le aviso a express que el cliente le estará enviando invformación en formato json:
  */
    app.use(express.json());
    /* 
  //instancio la información estática:
  */
    app.use("/", express.static("./src/public"));

    /*
  //instancio la ingeniería de handlebars:
  */
    app.engine("handlebars", handlebars.engine());
    app.set("views", "./src/views");
    app.set("view engine", "handlebars");

    /*
  //le aviso al servidor que va a trabajar información en formularios:
  */
    app.use(express.urlencoded({ extended: true }));
    /*
  le aviso al servidor que va a usar cookierParser para trabajar cookies:
  */
    app.use(cookieParser());

    app.use(
      compression({
        brotli: { enabled: true, zlib: {} },
      })
);
    app.use(errorHandler);
    /*
  conecto a mongo: */
    const client = new mongoClient();
    client.connect();
    
  } catch (error) {
    console.log("error en engineer.js: ",error);
    
  }
}
