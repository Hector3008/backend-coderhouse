
//importo express:
import  express  from "express";
import handlebars from 'express-handlebars'
import { Server } from "socket.io";
import ProductManager from "./productManager.js";
import  productRouter  from "./routers/productRouter.js";
import cartsRouter from './routers/cartsRouter.js';
import  viewsRouter  from './routers/view.router.js'


//instancio su variable de acceso al servidor express: 

const app = express()

//le aviso a express que el cliente le estará enviando invformación en formato json:
app.use(express.json())
//instancio la información estática:
app.use('/', express.static('./src/public'))

//instancio la ingeniería de handlebars:
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

//genero las rutas del servidor:
      //vista principal
    app.get("/", async (req, res) => 
    
    {
      const productManager = new ProductManager("./data/products.json");
      const products = await productManager.getProducts();
      res.render("index.handlebars",{products})});
      //routers: 
    app.use("/api/products", productRouter);
    app.use("/api/carts", cartsRouter)
    app.use('/products', viewsRouter)

//ejecuto el servidor:

    //instancio el servidor http:
  const httpServer = app.listen(8080,()=> console.log('server up!'))
    //instancio el servidor websocket:
  const io = new Server(httpServer)

  //inicializo el flujo de información cliente/servidor:
  io.on("connection", (socket) => {
    console.log("new client connected");
    
    //estos mensajes emitidos vienen desde el archivo index.js:
    socket.on("productList", (data) => {
      //se emiten desde el servidor:
//      alert("socket recibido en el servidor")
      io.emit("updatedProducts", data);
  //    alert("socket recibido desde el servidor");
    });
  });