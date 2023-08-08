import { ProductManager } from "./productManager.js";
//CREACIÓN DE LA CLASE:

const productManager = new ProductManager('./products.json')

//CREACION DE PRODUCTOS:
const prod1 = {
  title: "title",
  description: "description",
  price: 40,
  thumbnail: "thumbnail",
  code: "code",
  stock: 5,
};
const prod2 = {
  title: "title",
  price: 40,
  thumbnail: "thumbnail",
  code: "code2",
  stock: 5,
};
const prod3 = {
  title: "title",
  description: "",
  price: 40,
  thumbnail: "thumbnail",
  code: "code",
  stock: 5,
};

const test = async()=>{
  console.log('test:');
  console.log('getProducts()=>devuelve un array vacío:');
  console.log(await productManager.getProducts());

  console.log("test: ");
  console.log("addProducts(prod1) devuelve el producto creado:");
  console.log(await productManager.addProduct(prod1));

  console.log("test:");
  console.log('hago un getProducts():');
  console.log(await productManager.getProducts());

  console.log('test: ');
  console.log('addProducts(prod3) tiene un código repetido:');
  console.log(await productManager.addProduct(prod3));
  
  console.log("test:");
  console.log('hago un getProducts():');
  console.log(await productManager.getProducts());

  console.log("test");
  console.log("cargo un producto con campos vacíos:");
  console.log(await productManager.addProduct(prod2))

  console.log("test:");
  console.log('hago un getProducts():');
  console.log(await productManager.getProducts());
 
  console.log("test:");
  console.log('hago un getProductsByID(1) (ID existente):');
  console.log(await productManager.getProductByID(1));

  console.log("test:");
  console.log('hago un getProductsByID(2). (ID no existente):');
  console.log(await productManager.getProductByID(2));

  console.log("test:");
  console.log("updateProduct(1,(price:250). devuelve el producto actualizado:");
  console.log(await productManager.updateProduct(1, { price: 250 }));

  console.log("test:");
  console.log("updateProduct(2,(price:250). devuelve error por producto no encontrado:");
  console.log(await productManager.updateProduct(2, { price: 250 }));

  console.log("test:");
  console.log(
    "deleteProduct(1) devuelve la lista de productos sin el artículo eliminado:"
  );
  console.log(await productManager.deleteProduct(1));

  console.log("test:");
  console.log(
    "deleteProduct(2) devuelve error por producto inexistente:"
  );
  console.log(await productManager.deleteProduct(2));

}

test()