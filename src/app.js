import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";

import product from "./routers/productsRouter.js";
import carts from "./routers/cartsRouter.js";
import productsViews from "./routers/productsViewRouter.js";
import cartsViews from "./routers/cartsViewRouter.js";
import sessions from "./routers/sessionsRouter.js";
import sessionsViews from "./routers/sessionsViewRouter.js";

//import { Command } from "commander";
import cfg from "./config/config.js";
import engineer  from "./engineer.js";


/*consulta al tutor: 
//deseo instanciar una vde compuesta de otras vde, pero no sé cómo declararla aún.
*/
    const MONGO_URI = `mongodb+srv://${cfg.MONGO_DB_ADMIN_NAME}:${cfg.MONGO_DB_CLOUD_ADMIN_DB}@e-comerce.bpmaosh.mongodb.net/`;
    /* ejemplo:
    const variable = process.env.MONGO_URI;
    console.log(MONGO_URI);
    console.log(variable);
    */

/*
inicializo el servidor:
*/
const app = express();

engineer(app)


try {
  await mongoose.connect(MONGO_URI, {
    dbName: cfg.MONGO_DB_NAME,
    useUnifiedTopology: true,
  });
  console.log("mongo conection success!");

  /*
  ejecuto el servidor:

  instancio el servidor http:
*/
  const httpServer = app.listen(cfg.PORT, () => console.log("server up!"));
  /*
  //instancio el servidor websocket:
  */
  const io = new Server(httpServer);

  app.get("/", async (req, res) => {
    const SEO = { title: "E-Commerce" };
    res.render("index.handlebars", { SEO: SEO });
    res.redirect("/sessions/register");
  });
  app.get("/error", async (req, res) => {res.render("error.handlebars")});
  app.use("/api/products", product);
  app.use("/api/carts", carts);
  app.use("/api/sessions/", sessions);
  app.use("/products", productsViews);
  app.use("/carts", cartsViews);
  app.use("/sessions/", sessionsViews);

  /*
 //inicializo el flujo de información cliente/servidor (lógica del real_time_products):

 */
  io.on("connection", (socket) => {
    console.log("new client connected");

    //estos mensajes emitidos vienen desde el archivo index.js:
    socket.on("productList", (data) => {
      io.emit("updatedProducts", data);
    });
  });
} catch (err) {
  console.log("error", err.message);
  /*
  //cierro el node con esta línea:
  */
  process.exit(-1);
}


