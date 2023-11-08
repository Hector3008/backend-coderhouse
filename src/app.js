import express from "express";
import { Server } from "socket.io";
import cfg from "./config/config.js";
import engineer from "./engineer.js";

import product from "./routers/productsRouter.js";
import carts from "./routers/cartsRouter.js";
import productsViews from "./routers/productsViewRouter.js";
import cartsViews from "./routers/cartsViewRouter.js";
import sessions from "./routers/sessionsRouter.js";
import sessionsViews from "./routers/sessionsViewRouter.js";
import { productDao } from "./services/persistenceFactory.js";
import { ProductService } from "./services/index.js";

/*
//inicializo el servidor:
*/
const app = express();

//console.log("productDao.getAllProducts: ", new productDao());
console.log("productService ",ProductService);
console.log("productService.getAll(): ", ProductService.getAll());
try {
  engineer(app);
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
  app.get("/error", async (req, res) => {
    res.render("error.handlebars");
  });

  app.use("/api/products", product);
  app.use("/api/carts", carts);
  app.use("/api/sessions/", sessions);
  app.use("/products", productsViews);
  app.use("/carts", cartsViews);
  app.use("/sessions/", sessionsViews);

  app.use("*", async (req, res) => {
    res.render("error.handlebars");
  });
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
  console.log("all on right!");
} catch (err) {
  console.log("error", err.message);
  /*
  //cierro el node con esta línea:
  */
  process.exit(-1);
}
