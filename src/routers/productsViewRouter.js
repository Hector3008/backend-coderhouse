import { Router } from "express";
import {
  productsViewController as productsV,
  realTimeProductsController as rtproducts,
  productViewController as productV,
  viewController,
} from "../controllers/products.controller.js";
import { handlePolicies as hp }  from "../../utils.js";

const productsViewsRouter = Router();
/*  
//acá visualizo todos los productos en una tabla y los puedo agregar a un carrito:
*/
productsViewsRouter.get("/", hp(["user", "admin","premium"]), productsV);

productsViewsRouter.get("/view2", viewController);
/* 
//acá visualizo un formulario para crear nuevos productos y una tabla para ver sus cambios en tiempo real (también los puedo eliminar):
*/
productsViewsRouter.get("/realTimeProducts", hp(["admin", "premium"]), rtproducts);
/* 
//acá visualizo un producto en específico en una tabla y lo puedo agregar a un carrito:
*/
productsViewsRouter.get("/:id", hp(["user", "admin", "premium"]), productV);
export default productsViewsRouter;
