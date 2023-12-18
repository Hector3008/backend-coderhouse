import { Router } from "express";
import {
  productsController as products,
  productController as product,
  createProductController as createProd,
  updateProductController as updateProd,
  deleteProductController as deleteProd,
} from "../controllers/products.controller.js";
import { handlePolicies as hp } from "../../utils.js";

const productRouter = Router();

/*
//testeado.✅ */
productRouter.get("/", products);
/*
//testeado.✅ sólo un problema: el query inválido me remite al mensaje del catch y no de la validación que le monto.*/
productRouter.get("/:pid", product);
/*
//testeado.✅ la consulta en TC no me trae la bdd actualizada después pero en compass logro ver el cambio. También hay que trabajar las validaciones.*/
productRouter.post("/", hp(["admin", "premium"]), createProd);
/*
//testeado.✅*/
productRouter.put("/:pid", hp(["admin", "premium"]), updateProd);
/*
//testeado.✅*/
productRouter.delete("/:pid", hp(["admin", "premium"]), deleteProd);

export default productRouter;