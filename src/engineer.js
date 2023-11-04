import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import cfg from "./config/config.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

/*
  //ingeniería de session y cookies:
*/
export default  (app) => {
  try {
    console.log("engineer up!");
  app.use(
    session({ secret: cfg.SESSION_SIGN, resave: true, saveUninitialized: true })
  );

  /*
  //ingeniería de passport:
  */
  initializePassport();
  app.use(passport.initialize());
  app.use(passport.session());

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
  } catch (error) {
    console.log(error);
    
  }
}
