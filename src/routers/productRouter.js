import { Router } from "express";
import {ProductManager} from '../productManager.js'

export const productRouter = Router()
const productManager = new ProductManager('../data/products.json')

productRouter.get("/", async (req, res) => {
  const result = await productManager.getProducts();
  const limit = req.query.limit;
  if (typeof result == "string") {
    const error = result.split(" ");
    return res
      .status(parseInt(error[0].slice(1, 4)))
      .json({ error: result.slice(6) });
  }
  res.status(200).json({ status: "success", payload: result.slice(0, limit) });
});

productRouter.get("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const result = await productManager.getProductByID(id);
  if (typeof result == "string") {
    return res
      .status(404)
      .json({ payload: "error 404", error: result});
  }
  res.status(200).json({ status: "success", payload: result });
});

productRouter.post("/", async (req, res) => {
  const product = req.body;
  const result = await productManager.addProduct(product);
  if (typeof result == "string") {
    const error = result.split(" ");
    return res.status(404).json({ payload: "error 404", error: result });
  }
  res.status(201).json({ status: "success", payload: result });
});

productRouter.put("/:pid", async (req, res) => {

  const id = parseInt(req.params.pid);
  const data = req.body;
  const result = await productManager.updateProduct(id, data);

  if (typeof result == "string") {
    const error = result.split(" ");
    return res.status(parseInt(error[0].slice(1, 4))).json({ error: "product does not exist" });
  }
  
  return res.status(201).json({ status: "success", payload: result });

});

productRouter.delete("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const result = await productManager.deleteProduct(id);

  return res.status(201).json({ status: "success", payload: result });
});


