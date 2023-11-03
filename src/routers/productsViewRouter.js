import { Router } from "express";
import { getProducts } from "../controllers/productsControllers.js";
import { PORT } from "../app.js";
import productModel from "../dao/models/product.model.js";
import { handlePolicies } from "../../utils.js";
const productsViewsRouter = Router();

//acá visualizo todos los productos en una tabla y los puedo agregar a un carrito:
productsViewsRouter.get("/", handlePolicies(["user", "admin"]),async (req, res) => {

  const result = await getProducts(req, res);

  if (result.statusCode === 200) {
    const totalPages = [];
    let link;

    for (let index = 1; index <= result.response.totalPages; index++) {
      if (!req.query.page) {
        link = `http://${req.hostname}:${PORT}${req.originalUrl}?page=${index}`;
      } else {
        const modifiedUrl = req.originalUrl.replace(
          `page=${req.query.page}`,
          `page=${index}`
        );
        link = `http://${req.hostname}:${PORT}${modifiedUrl}`;
      }
      totalPages.push({ page: index, link });
    }
    const SEO = {
      title: "products",
    };
    res.render("products.handlebars", {
      products: result.response.payload,
      paginateInfo: {
        hasPrevPage: result.response.hasPrevPage,
        hasNextPage: result.response.hasNextPage,
        prevLink: result.response.prevLink,
        nextLink: result.response.nextLink,
        totalPages,
      },
      SEO: SEO,
      user: req.session.user,
    });
  } else {
    res
      .status(result.statusCode)
      .json({ status: "error", error: result.response.error });
  }
});
//acá visualizo un formulario para crear nuevos productos y una tabla para ver sus cambios en tiempo real (también los puedo eliminar):
productsViewsRouter.get(
  "/realTimeProducts",
  handlePolicies(["admin"]),
  async (req, res) => {
    //const products = await productManager.getProducts();
    const SEO = {
      title: "realTimeProducts",
    };
    //consulto los productos en mi bdd de productos:
    const result = await getProducts(req, res);
    if (result.statusCode === 200) {
      //renderizo la plantilla realTimeProducts y le cargo el resultado de mi consulta a la bdd de productos:
      res.render("realTimeProducts.handlebars", {
        products: result.response.payload,
        SEO: SEO,
        user: req.session.user,
      });
    } else {
      res
        .status(result.statusCode)
        .json({ status: "error", error: result.response.error });
    }
  }
);
//acá visualizo un producto en específico en una tabla y lo puedo agregar a un carrito:
productsViewsRouter.get("/:id", handlePolicies(["user", "admin"]), async (req, res) => {
  const id = req.params.id;

  const product = await productModel.findById(id);

  const SEO = {
    title: product.title,
  };

  res.render("product.handlebars", {
    SEO: SEO,
    product: {
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      status: product.status,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock,
      category: product.category,
    },
    user: req.session.user,
  });
});
export default productsViewsRouter;
