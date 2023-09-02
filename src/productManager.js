import fs from "fs";

class ProductManager {
  #path;
  constructor(path) {
    this.#path = path;
    this.#init();
  }
  async #init() {
    if (!fs.existsSync(this.#path)) {
      await fs.promises.writeFile(this.#path, JSON.stringify([], null));
    }
  }
  #generateID(products) {
    return products.length === 0 ? 1 : products[products.length - 1].id + 1;
  }

  //métodos de la clase: 
  async addProduct(product) {
    
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.category || !stock
    )
      return "[ERR] require fields missing";

    if (!fs.existsSync(this.#path)) return "[ERR] DB file does not exists";

    let data = await fs.promises.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);
    const found = products.find((i) => i.code === product.code);

    if (found) return "[ERR] code already exists";
    //hardcodeo el status en true:
    const productToAdd = { id: this.#generateID(products), status: true, ...product };
    products.push(productToAdd);
    
    await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2));
    return productToAdd;
  }
  async updateProduct(id, updateProduct) {
    if (!fs.existsSync(this.#path)) return "[ERR] DB file does not exist";

    let isFound = false;
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);
    let newProducts = products.map((i) => {
      //encuentro los datos del item por actualizar:
      if (i.id == id) {
        isFound = true;
        //genero el producto actualizado:
        return {
          //cargo los datos originales:
          ...i,
          //le actualizo los datos del req:
          ...updateProduct,
        };
      } else return i;
    });
    if (!isFound) return "[ERR] Product does not exist";
    //actualizo la bdd:
    await fs.promises.writeFile(
      this.#path,
      JSON.stringify(newProducts, null, 2)
    );
    return newProducts.find((i) => i.id === id);
  }
  async deleteProduct(id) {
    //valido la existencia del path:
    if (!fs.existsSync(this.#path)) return "[ERR*] DB file does not exist";
    
    //intancio una variable de acceso para la bdd:
    let data = await fs.promises.readFile(this.#path, "utf-8");
    //parseo:
    let products = JSON.parse(data);

    let isFound = products.find(e=>e.id==id);
    //genero la nueva lista de productos sin el producto eliminado:
    let newProducts = products.filter((i) => i.id !== id);

    
    if (!isFound) return "[ERR] product does not exists";
    
    //cargo la actualización a la bdd:
    await fs.promises.writeFile(
      this.#path,
      JSON.stringify(newProducts, null, 2)
    );
    return newProducts;
  }
  async getProducts() {
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);
    return products;
  }
  async getProductByID(id) {

    let data = await fs.promises.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);
    const found = products.find((i) => i.id === id);
    if (!found) return "ERROR: producto no encontrado"
    return found;
  }
}

export default ProductManager;