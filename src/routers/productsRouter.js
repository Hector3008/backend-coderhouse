import { Router } from "express";
import productModel from "../dao/models/product.model.js";
import { getProducts } from "../controllers/productsControllers.js";

//import ProductManager from "../dao/fsManagers/productManager.js";
//const productManager = new ProductManager("./data/products.json");

const productRouter = Router();
//testeado.✅
productRouter.get("/", async (req, res) => {

  const result = await getProducts(req, res);
  res.status(result.statusCode).json(result.response);
});

//testeado.✅ sólo un problema: el query inválido me remite al mensaje del catch y no de la validación que le monto.
productRouter.get("/:pid", async (req, res) => {

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
    res.status(500).json({
      status: "error",
      error: err.message,
      test: "this is de catch message",
    });
  }
});

//testeado.✅ la consulta en TC no me trae la bdd actualizada después pero en compass logro ver el cambio. También hay que trabajar las validaciones.
productRouter.post("/", async (req, res) => {

  try {
    const product = req.body;
    console.log("product desde productRouter: ", product);
    const result = await productModel.create(product);
    console.log("result from productRouter", result);
    const products = await productModel.find().lean().exec();
    console.log("products from productRouter", products);
    try {
      req.originalUrl.emit("updatedProducts", products);
    } catch (err) {
      console.log(err);
    }

    res.status(201).json({ status: "success", payload: result });
  } catch (err) {
    res
      .status(500)
      .json({
        status: "error",
        error: err.message,
        test: "this is the catch error message",
      });
  }
});
//testeado.✅
productRouter.put("/:pid", async (req, res) => {

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
    try {
      req.io.emit("updatedProducts", products);
    } catch (err) {
      console.log(err);
    }

    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});
//testeado.✅
productRouter.delete("/:pid", async (req, res) => {

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
    res.status(500).json({
      status: "error",
      error: err.message,
      test: "this is the catch message",
    });
  }
});

export default productRouter;
