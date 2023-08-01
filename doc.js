//CREACIÓN DE LA CLASE:
class ProductManager {
  
  #products;
  constructor() {
    this.#products = [];
  }
  #generateID() {
    let id = 1;
    if (this.#products.length == 0) {
      id = 1;
    } else {
      id = this.#products[this.#products.length - 1].id + 1;
    }

    return id;
  }

  addProduct(product) {
    //r=respuesta:
    let r = undefined;
    //cond=condition:
    const cond1 =
      product.title ||
      product.description ||
      product.price ||
      product.thumbnail ||
      product.code ||
      product.stock;
    //i=item:
    const cond2 = this.#products.find((i) => i.code === product.code);
    
    //prodToAdd
    const operation = () => {
      const prodToAdd = {
        id: this.#generateID(),
        ...product,
      };
      this.#products.push(prodToAdd);
    };

    if (!cond1) {
      r = "ERROR: faltan campos por llenar";
    } else if (cond2) {
      r = "ERROR: el código ya existe";
    } else { r=
      operation();
    }

    return r;
  }

  getProducts() {
    return this.#products;
  }
  getProductByID(id) {

    let r = 2;

    const found = this.#products.find((i) => i.id === id);

    !found? r = "ERROR: producto no encontrado": r = found;

    return r;
  }
}

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
  description: "descripcion",
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
//CREACION DEL OBJETO:
let test = new ProductManager();


/*============================================================================================================================================
/*============================================================================================================================================
/*============================================================================================================================================ */

//TESTING A LOS METODOS:
test.getProducts();
console.log("test 1. getProducts a la lista original: ", test.getProducts());

test.addProduct(prod1);
console.log(
  "test 2: getProducts tras agregar el producto1: >>>>",
  test.getProducts()
);

console.log(
  "test 3: addProduct con un código ya existente en la bdd: >>>>",
  test.addProduct(prod1)
);

console.log(
  "test 4: getProducts tras testear el paso anterior: >>>>",
  test.getProducts()
);

test.addProduct(prod2);
console.log(
  "test 5: getProducts tras agregar el producto2 (es decir, uno válido): >>>>",
  test.getProducts()
);

console.log(
  "test 6: addProduct con un objeto creado sin algún campo: >>>>",
  test.addProduct(prod3)
);
console.log(
  "test 7: getProducts tras haber testeado el paso anterior: >>>>",
  test.getProducts()
);

console.log(
  "test 8: (id existente) => getProductByID(1): >>>>",
  test.getProductByID(1)
);

console.log(
  "test 9: (id inexistente): => getProductByID(5): >>>>",
  test.getProductByID(5)
);