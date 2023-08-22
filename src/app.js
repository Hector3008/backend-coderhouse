import fs from 'fs'
//importo express:
import  express  from "express";
import { productRouter } from "./routers/productRouter.js";
import { ProductManager } from './productManager.js';
import { cartsRouter } from './routers/cartsRouter.js';
import exp from 'constants';


/*
import productRouter from './routers/productRouter.js'
import cartsRouter from "./routers/cartsRouter.js";
*/

const path = "../data/products.json";

const init = async () => {
  if (!fs.existsSync(path)) {
    await fs.promises.writeFile(path, JSON.stringify([], null));
  }
};
init()

const productManager = new ProductManager(path);

//instanciación de la BDD:
let data = await fs.promises.readFile(path, "utf-8");
let products = JSON.parse(data);

//instancio su variable de acceso: 
const app = express()

//le aviso a express que el cliente le estará enviando invformación en formato json:
app.use(express.json())

app.use('/', express.static('../public'))
app.use(express.urlencoded({extended: true}))

//genero las rutas del servidor:
    //routers: 
    app.use("/api/products", productRouter);
    app.use("/api/carts", cartsRouter)

//ejecuto el servidor:
app.listen(8080,()=> console.log('server up!'))