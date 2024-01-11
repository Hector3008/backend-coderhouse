import { Router } from "express";

import {
  cartsController as carts,
  createCartController as createCart,
  cartController as cart,
  addProductToCartController as addProd,
  deleteProductFromCartController as deleteProd,
  updateCartController as updateCart,
  updateProductFromCartController as updateProd,
  clearCartController as clearCart,
  purchaseCartController as purchase,
  deleteCartByIdController as deleteCartById,
} from "../controllers/carts.controller.js";
import { handlePolicies as hp } from "../../utils.js";
const cartsRouter = Router();
/*✅✅✅
//testeado.✅*/
cartsRouter.get("/",hp(["admin", "premium", "user"]), carts);
/*✅✅✅
//testeado.✅
//creo un nuevo carrito:*/
cartsRouter.post("/", createCart);
/*✅✅✅
//testeado.✅
//consulto un carrito:*/
cartsRouter.get("/:cid", hp(["admin", "premium", "user"]), cart);
/*✅✅✅
//testeado.✅   //actualizo toda la lista de productos dentro de un carrito pasandole un objeto products desde el body. El objecto tiene un atributo product y Id por cada item.*/
cartsRouter.put("/:cid", hp(["admin", "premium", "user"]), updateCart);
/*✅✅✅
//testeado.✅ Solo hay un problema: cuando hay un error a validación me devuelve el return del catch final y no el que le estoy asignando

//elimino (vacío) todos los productos de un carrito:*/
cartsRouter.delete("/:cid", hp(["admin"]), clearCart);

cartsRouter.delete("/delete/:cid", deleteCartById)

///////////////////////////////////////////////////////////////////////////////////////
/*
//testeado.✅ Solo hay un problema: cuando hay un error a validación me devuelve el return del catch final y no el que le estoy asignando.
//agrego un producto a un carrito:*/
cartsRouter.post("/:cid/product/:pid",
  hp(["premium", "user"]),
  addProd
);
/*
//testeado.✅ Solo hay un problema: cuando hay un error a validación me devuelve el return del catch final y no el que le estoy asignando.

//elimino todos los items de un product específico que existan en el carrito:*/
cartsRouter.delete("/:cid/product/:pid",
  hp(["admin", "premium"]),
  deleteProd
);
/*
//testeado.✅ Solo hay un problema: A excepción del req.body (un bodyParam) cuando hay un error a validación me devuelve el return del catch final y no el que le estoy asignando.

//actualizo la cantidad de un item específico del carrito:*/
cartsRouter.put("/:cid/product/:pid",
  hp(["admin", "premium"]),
  updateProd
);

//////////////////////////////////////////////////////////////////////////////////////
cartsRouter.get("/:cid/purchase", hp(["admin", "premium", "user"]), purchase);

export default cartsRouter;
