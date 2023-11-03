//importaciones:
import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import session from "express-session";

import productRouter from "./routers/productsRouter.js";
import cartsRouter from "./routers/cartsRouter.js";
import productsViewsRouter from "./routers/productsViewRouter.js";
import cartsViewsRouter from "./routers/cartsViewRouter.js";
import sessionsRouter from "./routers/sessionsRouter.js";
import sessionsViewsRouter from "./routers/sessionsViewRouter.js";

import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import dotenv from "dotenv"
import { Command } from "commander";

//inicio la ingeniería de dotenv para llamar variables de entorno encriptadas:

dotenv.config()

  //instancio la variable para el puerto del sevidor:
  export const PORT = 8080;
  //cloud.mongodb variables:
  const MONGO_DB_ADMIN_NAME = process.env.MONGO_DB_ADMIN_NAME;
  const MONGO_DB_CLOUD_ADMIN_DB = process.env.MONGO_DB_CLOUD_ADMIN_DB;
  const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

  //deseo instanciar una vde compuesta de otras vde, pero no sé cómo declararla aún.
  const MONGO_URI = `mongodb+srv://${MONGO_DB_ADMIN_NAME}:${MONGO_DB_CLOUD_ADMIN_DB}@e-comerce.bpmaosh.mongodb.net/`;
    // const variable = process.env.MONGO_URI;
    // console.log(MONGO_URI);
    // console.log(variable);

  const SESSION_SIGN = process.env.SESSION_SIGN;

  
const app = express();

//ingeniería de session y cookies:
app.use(
  session({ secret: SESSION_SIGN, resave: true, saveUninitialized: true })
);

//ingeniería de passport:
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//le aviso a express que el cliente le estará enviando invformación en formato json:
app.use(express.json());
//instancio la información estática:
app.use("/", express.static("./src/public"));

//instancio la ingeniería de handlebars:
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

//le aviso al servidor que va a trabajar información en formularios:
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
//hago un try para condicionar el runing del servidor a la carga de mi mongoose.conection, es decir, mi bdd:
try {
  await mongoose.connect(MONGO_URI, {
    dbName: MONGO_DB_NAME,
    useUnifiedTopology: true,
  });
  console.log("mongo conection success!");

  //ejecuto el servidor:

  //instancio el servidor http:

  const httpServer = app.listen(PORT, () => console.log("server up!"));
  //instancio el servidor websocket:
  const io = new Server(httpServer);

  //genero las rutas del servidor:

  //routers:
  //vista principal (html on wire):
  app.get("/", async (req, res) => {
    const SEO = { title: "E-Commerce" };
    res.render("index.handlebars", { SEO: SEO });
    res.redirect("/sessions/register");
  });
  //err
  app.get("/error", async(req, res)=>{
    res.render('error.handlebars')
  })
  //data on wire:
  app.use("/api/products", productRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/api/sessions/", sessionsRouter);
  //htmlonwire:
  app.use("/products", productsViewsRouter);
  app.use("/carts", cartsViewsRouter);
  app.use("/sessions/", sessionsViewsRouter);

  //inicializo el flujo de información cliente/servidor (lógica del real_time_products):
  io.on("connection", (socket) => {
    console.log("new client connected");

    //estos mensajes emitidos vienen desde el archivo index.js:
    socket.on("productList", (data) => {
      io.emit("updatedProducts", data);
    });
  });
} catch (err) {
  console.log("error", err.message);
  //cierro el node con esta línea:
  process.exit(-1);
}


