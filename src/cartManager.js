import fs from 'fs'
import ProductManager from './productManager.js'

const productManager = new ProductManager('./data/products.json')

class CartManager {
  #path;
  constructor(path) {
    this.#path = path;
    this.#init();
  }

  async #init() {
    if (!fs.existsSync(this.#path)) {
      await fs.promises.writeFile(this.#path, JSON.stringify([], null, 2));
    }
  }

  #generateID(data) {
    return data.length === 0 ? 1 : data[data.length - 1].id + 1;
  }

  // métodos de la clase:

  async getCarts() {
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let carts = JSON.parse(data);
    return carts;
  }
  
  async createCart() {
    if (!fs.existsSync(this.#path)) return "[500] DB file does not exist";

    let data = await fs.promises.readFile(this.#path, "utf-8");
    let carts = JSON.parse(data);

    const cartToAdd = { id: this.#generateID(carts), products: [] };
    carts.push(cartToAdd);

    await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2));
    return cartToAdd;
  }
  async getProductsFromCart(id) {
    if (!fs.existsSync(this.#path)) return "[500] DB file does not exist";

    let data = await fs.promises.readFile(this.#path, "utf-8");
    let carts = JSON.parse(data);
    let cart = carts.find((i) => i.id === id);

    if (!cart) return "[404] not found";
    return cart;
  }
  async addProductToCart(cid, pid) {
    //validación a la existencia del path:

    if (!fs.existsSync(this.#path)) return "[500] DB file does not exist";

    const result = await productManager.getProductByID(pid);
    //validación a la existencia del pid:
    if (typeof result == "string")
      return `[404] product with ID=${pid} was not found`;

    const cart = await this.getProductsFromCart(cid);
    //validación a la existencia del cid:
    if (typeof cart == "string")
      return `[404] cart with id=${cid} was not found`;

    const productIndex = cart.products.findIndex((i) => i.product === pid);
    if (productIndex > -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let carts = JSON.parse(data);
    carts = carts.map((i) => {
      if (i.id === cid) {
        return cart;
      } else {
        return i;
      }
    });
    await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2));
    return cart;
  }
}
export default CartManager;