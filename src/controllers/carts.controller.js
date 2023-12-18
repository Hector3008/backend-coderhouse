import { CartService, ProductService, UserService } from "../services/services.js";

export const cartViewController = async (req, res) => {
  const id = req.params.cid;
  const result = await CartService.getProductsFromCart(req, res);
  //console.log(result);

  const SEO = {
    title: `cart: ${id}`,
  };
  //console.log(result.statusCode);
  //console.log("result.response.payload", result.response.payload);
  if (result.statusCode == "200") {
    res.render("productsFromCart.handlebars", {
      cart: result.response.payload._id,
      products: result.response.payload.products,
      SEO: SEO,
    });
  } else {
    res
      .status(result.statusCode)
      .json({ status: "error", error: result.response.error });
  }
};
export const cartsController = async (req, res) => {
  //const result = await getCarts(req, res);
  
  //res.status(result.statusCode).json(result.response);
  res.send("notyet")
};
export const createCartController = async (req, res) => {
  try {
    const result = await CartService.createCart({});
    
    res.status(500).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};
export const cartController = async (req, res) => {
  const result = await CartService.getProductsFromCart(req, res);
  res.status(result.statusCode).json(result.response);
};
export const addProductToCartController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    //accedo al carrito buscandolo por su id:
    const cartToUpdate = await CartService.getCartById(cid);
    
    //validación 1: el carrito existe en la bdd de carritos:
    if (cartToUpdate === null) {
      
      return res
        .status(404)
        .json({ status: "error", error: `Cart with id=${cid} Not found` });
    }

    //accedo al producto buscandolo por su id:
    const productToAdd = await ProductService.getById(pid);
    
    //validacion 2: el producto existe en la bdd de productos:
    if (productToAdd === null) {
      return res
        .status(404)
        .json({ status: "error", error: `Product with id=${pid} Not found` });
    }
        const user = UserService.findOne({ cart: cartToUpdate });
        if (user.role === "premium") {
          if (user.email === productToAdd.owner) {
            return res.status(404).json({
              status: error,
              error: "same user purchase request",
              description:
                "un usuario ha querido cargar a su carrito un producto de su misma tienda",
            });
          }
        }
    //consulto si el producto existe en la lista del carrito:
    
    const productIndex = cartToUpdate.products.findIndex(
      (item) => item.product._id == pid
    );
    //si está, le sumo 1 a la cantidad:
    if (productIndex > -1) {
      cartToUpdate.products[productIndex].quantity += 1;
    } else {
      //si no está, lo creo y le asigno valor 1 a la cantidad:
      cartToUpdate.products.push({ product: pid, quantity: 1 });
    }
    //finalmente, actualizo el documento con el método 'findByIdAndUpdate' del modelo:
    const result = await CartService.updateCart(cid, cartToUpdate, {
      returnDocument: "after",
    });
    //cargo la respuesta exitosa:
    res.status(201).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err.message,
      test: "this is the catch message",
    });
  }
};
export const deleteProductFromCartController = async (req, res) => {
  try {
    //instancio las variables de acceso a los params:
    const cid = req.params.cid;
    const pid = req.params.pid;
    //consulto en la bdd el documento por el id del cart:
    const cartToUpdate = await CartService.getCartById(cid);

    //validación 1: carrito inexiste en la bdd de los carritos:
    if (cartToUpdate === null) {
      return res
        .status(404)
        .json({ status: "error", error: `Cart with id=${cid} Not found` });
    }
    //consulto en la bdd de productos el producto a eliminar por su id:
    const productToDelete = await ProductService.getById(pid);
    //validación 2: producto inexistente en la bdd de los productos:
    if (productToDelete === null) {
      return res
        .status(404)
        .json({ status: "error", error: `Product with id=${pid} Not found` });
    }
    //consulto si el producto existe en el array de productos dentro del carrito:
    const productIndex = cartToUpdate.products.findIndex(
      (item) => item.product == pid
    );
    //validación 3: producto inexistente en el carrito:
    if (productIndex === -1) {
      return res.status(400).json({
        status: "error",
        error: `Product with id=${pid} Not found in Cart with id=${cid}`,
      });
    } else {
      //elimino el producto del carrito usando un filter:
      cartToUpdate.products = cartToUpdate.products.filter(
        //aprovecho que en la consulta sin populate solo me trae el id del producto (que convierto a string porque es un objectId de Mongoose) y lo comparo con el id de mi objeto:
        (item) => item.product.toString() !== pid
      );
    }
    //actualizo la bdd de carritos
    const result = await CartService.updateCart(cid, cartToUpdate, {
      returnDocument: "after",
    });
    //cargo la respuesta exitosa:
    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};
export const updateCartController = async (req, res) => {
  try {
    //instancio la variable de acceso al id del carrito tomandola desde el param:
    const cid = req.params.cid;
    //hago la consulta a la bdd de carritos para ver si existe:
    const cartToUpdate = await CartService.getCartById(cid);

    //validación 1: el carrito no existe en la bdd de carritos:
    if (cartToUpdate === null) {
      return res
        .status(404)
        .json({ status: "error", error: `Cart with id=${cid} Not found` });
    }
    //tomo los productos del body:
    const products = req.body.products;

    //start: validaciones del array enviado por body
    //validación 2: no hay nada en el body:
    if (!products) {
      return res
        .status(400)
        .json({ status: "error", error: 'Field "products" is not optional' });
    }

    for (let index = 0; index < products.length; index++) {
      //validación 3: no hay valor producto ni valor cantidad
      if (
        !products[index].hasOwnProperty("product") ||
        !products[index].hasOwnProperty("quantity")
      ) {
        return res.status(400).json({
          status: "error",
          error: "there is a product with not valid id or/nor a valid quantity",
        });
      }
      //validación 4: el valor cantidad no es un número:
      if (typeof products[index].quantity !== "number") {
        return res.status(400).json({
          status: "error",
          error: "there is a product which quantity is not a number",
        });
      }
      //validación 5: el valor cantidad es menor o igual a '0':
      if (products[index].quantity <= 0) {
        return res.status(400).json({
          status: "error",
          error: "there is a product which quantity is 0 nor negative",
        });
      }
      //consulto si el producto existe en el carrito:
      const productToAdd = await ProductService.getById(products[index].product);
      //validación 6: el producto no existe en el carrito:
      if (productToAdd === null) {
        return res.status(400).json({
          status: "error",
          error: `Product with id=${products[index].product} doesnot exist. We cannot add this product to the cart with id=${cid}`,
        });
      }
    }
    //end: validaciones del array enviado por body
    //actualizo el array de productos de mi carrito:
    cartToUpdate.products = products;
    //actualizo el documento de mi bdd de cloud.mongo carritos con el nuevo array:
    const result = await CartService.updateCart(cid, cartToUpdate, {
      returnDocument: "after",
    });
    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err.message,
      test: "this is the catch message",
    });
  }
};
export const updateProductFromCartController = async (req, res) => {
  try {
    //instancio las variables de acceso al id del carrito y al id del producto desde los params:
    const cid = req.params.cid;
    const pid = req.params.pid;
    //consulto en la bdd de carritos por un carrito con el id de mi consulta:
    const cartToUpdate = await CartService.getCartById(cid);
    //validación 1: no existe el carrito en la bdd:
    if (cartToUpdate === null) {
      return res
        .status(404)
        .json({ status: "error", error: `Cart with id=${cid} Not found` });
    }
    //consulto en la bdd de productos por un producto con el id de mi consulta:
    const productToUpdate = await ProductService.getById(pid);
    //validación 2: no existe el producto en la bdd:
    if (productToUpdate === null) {
      return res
        .status(404)
        .json({ status: "error", error: `Product with id=${pid} Not found` });
    }
    //instancio la variable de acceso al catidad por el dato tomado del body:
    const quantity = req.body.quantity;
    //start: validaciones de quantity enviado por body
    //validación 3: la cantidad no existe en el body:
    if (!quantity) {
      return res
        .status(400)
        .json({ status: "error", error: 'Field "quantity" is not optional' });
    }
    //validación 4: el valor de cantidad no es un numero:
    if (typeof quantity !== "number") {
      return res.status(400).json({
        status: "error",
        error: "product's quantity must be a number",
      });
    }
    //validación 5: el valor de cantidad es 0:
    if (quantity <= 0) {
      return res.status(400).json({
        status: "error",
        error: "product's quantity cannot be 0 nor negative",
      });
    }
    //validación 6: el valor de cantidad es float (decimal):
    function isFloat(numero) {
      return (
        typeof numero === "number" && !Number.isNaN(numero) && numero % 1 !== 0
      );
    }
    if (isFloat(quantity)) {
      return res.status(400).json({
        status: "error",
        error: "product's quantity cannot be float",
      });
    }
    //consulto si el producto existe en la bdd productos de mi carrito:
    const productIndex = cartToUpdate.products.findIndex(
      (item) => item.product == pid
    );
    //validación 6: el producto no existe en la bdd de mi carrito:
    if (productIndex === -1) {
      return res.status(400).json({
        status: "error",
        error: `Product with id=${pid} Not found in Cart with id=${cid}`,
      });
    } else {
      //actualizo la cantidad en el carrito:
      cartToUpdate.products[productIndex].quantity = quantity;
    }

    //actualizo la bdd de carritos en mi mongo con el cambio en la cantidad de mi carrito:
    const result = await CartService.updateCart(cid, cartToUpdate, {
      returnDocument: "after",
    });
    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};
export const deleteItemProductFromCartController = async (req, res) => {
  console.log("/:cid/product/:pid/deleteOne delete fetch");
  res.send("/:cid/product/:pid/deleteOne done");
};
export const deleteCartController = async (req, res) => {
  
  try {
    //instancio la variable de acceso al id del carrito desde el params:
    const cid = req.params.cid;
    //consulto si el carrito con ese id existe en mi bdd de carritos:
    const cartToUpdate = await CartService.getCartById(cid);
    //validación 1: el carrito no existe en la bdd de carritos:
    if (cartToUpdate === null) {
      return res
        .status(404)
        .json({ status: "error", error: `Cart with id=${cid} Not found` });
    }
    //vacío la lista de productos en ese carrito:
    cartToUpdate.products = [];
    //actualizo el carrito en la bdd de carritos:
    const result = await CartService.updateCart(cid, cartToUpdate, {
      returnDocument: "after",
    });
    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};
export const purchaseCartController = async (req,res)=>{
   const cid = req.params.cid;
   
   /*
   validaciones ⬇️⬇️⬇️*/
  const cart = await CartService.getCartById(cid)

  if (cart === null) {//console.log(cart);
    return res.status(500).json({ status: "error", message:`cart with id ${cid} not found`})}
  
  res.status(202).json({ status: "success", payload: `cart with id ${cid}`});
}