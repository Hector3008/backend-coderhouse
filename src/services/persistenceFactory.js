import cfg from "../config/config.js";

console.log("persistencia en: ", cfg.PERSISTENCE);

export let productDao;

switch (cfg.PERSISTENCE) {
  case "mongo":
    const { default: ProductMongoDAO } = await import(
      "../dao/product.dao.mongo.js"
    );
    productDao = ProductMongoDAO;
    break;
  default:
    break;
}
