import fs from "fs";
import express from "express";
import { productManager } from "./index.js";

//acceso a la BDD:
const path = "./products.json";

//inicialización de la BDD:
const init = async () => {
  if (!fs.existsSync(path)) {
    await fs.promises.writeFile(path, JSON.stringify([], null));
  }
};
//instanciación de la BDD:
let data = await fs.promises.readFile(path, "utf-8");
let products = JSON.parse(data);
//creación del servidor:
const app = express();

//instanciación de las rutas del servidor:

  app.get("/", (req, res) => {
    res.send("hola mundo");
  });

  app.get("/products",async  (req, res) => {
    const result = products
    const limit = req.query.limit
    if(typeof result =='string'){
      const error = result.split('')
      return res.status(parseInt(error[0].slice(1,4))).json({error: result.slice(6)})
    }
    res.status(200).json({payload: result.slice(0, limit)})
  });

  app.get("/products/:id", async (req, res)=>{
    const id = parseInt(req.params.id)
    const result = await productManager.getProductByID(id)
    if (typeof result == 'string'){
      return res.status(404).json({"payload": "error","error":'[ERR] product does not found'})
    }
    res.status(200).json({payload: result})
  })

//ejecución del servidor:
app.listen(8080, () => console.log("server up!"));
