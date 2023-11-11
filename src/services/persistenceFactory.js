import cfg from "../config/config.js";
console.log("persistencia en: ", cfg.PERSISTENCE);

export let productDao;
export let cartDao


switch (cfg.PERSISTENCE) {
  case "mongo":
    // Importing named exports
      const { default: ProductMongoDAO } = await import(
        "../dao/product.dao.mongo.js"
      );
      productDao = ProductMongoDAO;

      const { default: CartMongoDAO } = await import(
        "../dao/cart.dao.mongo.js"
      );
      cartDao = CartMongoDAO

    break;
  default:
    // Handle default case or throw an error
    throw new Error(`Unsupported persistence type: ${cfg.PERSISTENCE}`);
}