import { Router } from "express";
import {
  productsController,
  realTimeProductsController,
  productController,
} from "../controllers/products.controller.js";
import { handlePolicies as hp }  from "../../utils.js";
const productsViewsRouter = Router();

/*1:  
//acá visualizo todos los productos en una tabla y los puedo agregar a un carrito:
*/
productsViewsRouter.get("/", hp(["user", "admin"]), productsController);

/*2: 
//acá visualizo un formulario para crear nuevos productos y una tabla para ver sus cambios en tiempo real (también los puedo eliminar):
*/
productsViewsRouter.get(  "/realTimeProducts",  hp(["admin", "user"]),realTimeProductsController);

/*3: 
//acá visualizo un producto en específico en una tabla y lo puedo agregar a un carrito:
*/
productsViewsRouter.get("/:id", hp(["user", "admin"]), productController);

export default productsViewsRouter;
