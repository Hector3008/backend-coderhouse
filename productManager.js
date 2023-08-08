import fs from 'fs'

export class ProductManager {
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
  async addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code
    )
      return "[ERR] require fields missing";

    if (!fs.existsSync(this.#path)) return "[ERR] DB file does not exists";

    let data = await fs.promises.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);
    const found = products.find((i) => i.code === product.code);
    if (found) return "[ERR] code already exists";
    const productToAdd = { id: this.#generateID(products), ...product };
    products.push(productToAdd);
    await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2));
    return productToAdd;
  }
  async updateProduct(id, updateProduct) {
    if (!fs.existsSync(this.#path)) return "[ERR] DB file does not exist";
    let isFound = false;
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);
    let newProducts = products.map((item) => {
      if (item.id === id) {
        isFound = true;
        return {
          ...item,
          ...updateProduct,
        };
      } else return item;
    });
    if (!isFound) return "[ERR] Product does not exist";
    await fs.promises.writeFile(
      this.#path,
      JSON.stringify(newProducts, null, 2)
    );
    return newProducts.find((i) => i.id === id);
  }
  async deleteProduct(id) {
    if (!fs.existsSync(this.path)) return "[ERR*] DB file does not exist";
    let isFound = false;
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);
    let newProducts = products.filter((i) => i.id !== id);
    if (!isFound) return "[ERR] product does not exists";
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
    let r = 2;

    let data = await fs.promises.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);

    const found = products.find((i) => i.id === id);

    !found ? (r = "ERROR: producto no encontrado") : (r = found);

    return r;
  }
}














