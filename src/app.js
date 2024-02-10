import express from "express";
import { Server } from "socket.io";
import cfg from "./config/config.js";
import engineer from "./engineer.js";

import Sockets from "./sockets.js";

import product from "./routers/productsRouter.js";
import carts from "./routers/cartsRouter.js";
import productsViews from "./routers/productsViewRouter.js";
import cartsViews from "./routers/cartsViewRouter.js";
import sessions from "./routers/sessionsRouter.js";
import sessionsViews from "./routers/sessionsViewRouter.js";
import users from "./routers/usersRouter.js";
import tickets from "./routers/ticketRouter.js";
import chat from "./routers/chatRouter.js";
import checkout from "./routers/checkoutRouter.js";
import ticketsView from "./routers/ticketViewRouter.js";
import usersView from "./routers/usersViewRouter.js";
/*
//inicializo el servidor:
*/
const app = express();

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

  app.use("/api/products", product);
  app.use("/api/checkout", checkout);
  app.use("/api/carts", carts);
  app.use("/api/sessions/", sessions);
  app.use("/products", productsViews);
  app.use("/carts", cartsViews);
  app.use("/sessions/", sessionsViews);
  app.use("/users", usersView);
  app.use("/api/tickets", tickets);
  app.use("/tickets", ticketsView);
  app.use("/chat", chat);
  app.use("/api/users", users);
  app.get("/view", async (req, res) => {
    const user = req.session.user;
    res.render("checkout.handlebars", { user: user });
  });

  app.use("*", async (req, res) => {
    res.render("error.handlebars");
  });

  /*
 //inicializo el flujo de información cliente/servidor (lógica del real_time_products):

 */
  Sockets(io);
  console.log("all on right!");
} catch (err) {
  console.log("error", err.message);
  /*
  //cierro el node con esta línea:
  */
  process.exit(-1);
}
