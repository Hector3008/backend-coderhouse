//importaciones:
import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import session from "express-session";

import productRouter from "./routers/dataOnWire/productsRouter.js";
import cartsRouter from "./routers/dataOnWire/cartsRouter.js";
import productsViewsRouter from "./routers/htmlOnWire/productsViewRouter.js";
import cartsViewsRouter from "./routers/htmlOnWire/cartsViewRouter.js";
import sessionsRouter from "./routers/dataOnWire/sessionsRouter.js";
import sessionsViewsRouter from "./routers/htmlOnWire/sessionsViewRouter.js";

import cookieParser from "cookie-parser";

//instancio la variable para el puerto del sevidor:
export const PORT = 8080;
//cloud.mongodb variables:
const MONGO_DB_ADMIN_NAME = "admin";
const MONGO_DB_CLOUD_ADMIN_DB = "LHHv7KiR2v7XPDja";

const MONGO_URI = `mongodb+srv://${MONGO_DB_ADMIN_NAME}:${MONGO_DB_CLOUD_ADMIN_DB}@e-comerce.bpmaosh.mongodb.net/`;

const MONGO_DB_NAME = "e-comerce";

const app = express();

app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));
//le aviso a express que el cliente le estará enviando invformación en formato json:
app.use(express.json());
//instancio la información estática:
app.use("/", express.static("./src/public"));

//instancio la ingeniería de handlebars:
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.use(cookieParser())
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

/*    const productManager = new ProductManager("./data/products.json");
    const products = await productManager.getProducts();*/
    
    const SEO = {title: "E-Commerce"}
    res.render("index.handlebars", { SEO: SEO });
    res.redirect('/sessions/register')
  });

  //data on wire:
  app.use("/api/products", productRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/api/sessions/", sessionsRouter);
  //htmlonwire:
  app.use("/products", productsViewsRouter);
  app.use("/carts", cartsViewsRouter);
  app.use("/sessions/", sessionsViewsRouter);
  
//le aviso al servidor que va a trabajar información en formularios:
  app.use(express.urlencoded({ extended: true }));
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
