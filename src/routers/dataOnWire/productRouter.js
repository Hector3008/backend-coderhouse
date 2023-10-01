import { Router } from "express";
import productModel from "../../dao/models/product.model.js";
import getProducts from "../../controllers/getProducts.js";

//import ProductManager from "../dao/fsManagers/productManager.js";
//const productManager = new ProductManager("./data/products.json");

const productRouter = Router();
//testeado.✅
productRouter.get("/", async (req, res) => {
  /*FS manner:
  const result = await productManager.getProducts();
  const limit = req.query.limit;
  if (typeof result == "string") {
    const error = result.split(" ");
    return res
      .status(parseInt(error[0].slice(1, 4)))
      .json({ error: result.slice(6) });
  }
  res.status(200).json({ status: "success", payload: result.slice(0, limit) });
*/
  const result = await getProducts(req, res);
  res.status(result.statusCode).json(result.response);
});

//testeado.✅ sólo un problema: el query inválido me remite al mensaje del catch y no de la validación que le monto.
productRouter.get("/:pid", async (req, res) => {
  /*FS manner:
    const id = parseInt(req.params.pid);
    const result = await productManager.getProductByID(id);
    if (typeof result == "string") {
      return res.status(404).json({ payload: "error 404", error: result });
    }
    res.status(200).json({ status: "success", payload: result });
*/

  try {
    //instancio las variables de acceso al id con el query param:
    const id = req.params.pid;
    //consulto en la bdd de productos en mi cloud.mongo por un producto con ese id:
    const result = await productModel.findById(id).lean().exec();
    //validación 1: producto con id presente en la bdd:
    if (result === null) {
      return res.status(404).json({ status: "error", error: "Not found" });
    }
    //retorno la respuesta con el resultado de mi consulta en el payload:
    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res
      .status(500)
      .json({
        status: "error",
        error: err.message,
        test: "this is de catch message",
      });
  }
});

//testeado.✅ la consulta en TC no me trae la bdd actualizada después pero en compass logro ver el cambio. También hay que trabajar las validaciones.
productRouter.post("/", async (req, res) => {
  /*FS manner:
    const product = req.body;

    const result = await productManager.addProduct(product);
    if (typeof result == "string") {
      return res.status(404).json({ payload: "error 404", error: result });
    }
    res.status(201).json({ status: "success", payload: result });
*/
  try {
    const product = req.body;
    const result = await productModel.create(product);
    const products = await productModel.find().lean().exec();

    try {
      req.originalUrl.emit("updatedProducts", products);
    } catch (err) {
      console.log(err);
    }

    res.status(201).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message, test: "this is the catch error message" });
  }
});
//testeado.✅
productRouter.put("/:pid", async (req, res) => {
  /*FS manner:
  const id = parseInt(req.params.pid);
  const data = req.body;
  const result = await productManager.updateProduct(id, data);

  if (typeof result == "string") {
    const error = result.split(" ");
    return res
      .status(parseInt(error[0].slice(1, 4)))
      .json({ error: "product does not exist" });
  }

  return res.status(201).json({ status: "success", payload: result });
*/
  try {
    //instancio la variable de acceso al Id del producto desde el param:
    const id = req.params.pid;
    //instancio la data desde el body:
    const data = req.body;
    //actualizo 
    const result = await productModel.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    });
    if (result === null) {
      return res.status(404).json({ status: "error", error: "Not found" });
    }

    const products = await productModel.find().lean().exec();
    try {req.io.emit("updatedProducts", products)} catch(err){console.log(err)}
    
    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});
//testeado.✅
productRouter.delete("/:pid", async (req, res) => {
  /*FS manner:
  const id = parseInt(req.params.pid);
  const result = await productManager.deleteProduct(id);

  return res.status(201).json({ status: "success", payload: result });
*/
  try {
    //accedo al id desde el param:
    const id = req.params.pid;
    3;
    //consulto si el producto con ese id existe en mi bdd productos de cloud.mongo:
    const result = await productModel.findByIdAndRemove(id);
    //validación 1: el producto con ese id existe en la bdd:
    if (result === null) {
      return res.status(404).json({ status: "error", error: "Not found" });
    }
    //accedo a la lista de productos en mi bdd:
    const products = await productModel.find().lean().exec();

    //condiciono a un try la lógica del socket:

    //cargo la lista al payload de mi respuesta:
    res.status(200).json({ status: "success", payload: products });
  } catch (err) {
    res
      .status(500)
      .json({
        status: "error",
        error: err.message,
        test: "this is the catch message",
      });
  }
});

export default productRouter;
