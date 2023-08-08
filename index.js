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
  console.log('getProducts()=>devuelve un array vacío: ');
  console.log(await productManager.getProducts());

  console.log("test: ");
  console.log("addProducts(prod1) devuelve el producto creado");
  console.log(await productManager.addProduct(prod1));

  console.log("test:");
  console.log('hago un getProducts()');
  console.log(await productManager.getProducts());

  console.log('test: ');
  console.log('addProducts(prod3) tiene un código repetido');
  console.log(await productManager.addProduct(prod3));
  
  console.log("test:");
  console.log('hago un getProducts()');
  console.log(await productManager.getProducts());

  console.log("test");
  console.log("cargo un producto con campos vacíos");
  console.log(await productManager.addProduct(prod2))

  console.log("test:");
  console.log('hago un getProducts()');
  console.log(await productManager.getProducts());
}

test()