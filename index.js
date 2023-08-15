import { ProductManager } from "./productManager.js";
//CREACIÓN DE LA CLASE:

export const productManager = new ProductManager("./products.json");

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
  title: "title2",
  description: "descripti3on",
  price: 40,
  thumbnail: "thumbnai1l",
  code: "1asd2h3",
  stock: 5,
};
const prod3 = {
  title: "title3",
  description: "descripti3on",
  price: 40,
  thumbnail: "thumbnai1l",
  code: "1asd2hasdds3",
  stock: 5,
};
const prod4 = {
  title: "title4",
  description: "descripti3on",
  price: 40,
  thumbnail: "thumbnai1l",
  code: "1asd2fdssdfh3",
  stock: 5,
};const prod5 = {
  title: "title5",
  description: "descripti3on",
  price: 40,
  thumbnail: "thumbnai1l",
  code: "1asd2hasdasdds3",
  stock: 5,
};
const prod6 = {
  title: "title6",
  description: "descripti3on",
  price: 40,
  thumbnail: "thumbnai1l",
  code: "1asads2d2fdssdfh3",
  stock: 5,
};


const test = async()=>{
  await productManager.addProduct(prod1);
  await productManager.addProduct(prod2);
  await productManager.addProduct(prod3);
  await productManager.addProduct(prod4);
  await productManager.addProduct(prod5);
  await productManager.addProduct(prod6);
 }

test()
