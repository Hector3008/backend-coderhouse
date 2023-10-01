import { Router } from "express";
import getProducts from "../../controllers/getProducts.js";
import { PORT } from "../../app.js";

const productsViewsRouter = Router();

productsViewsRouter.get("/", async (req, res) => {
  /*FS manner:
  //const products = await productManager.getProducts();*/
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
    });
  } else {
    res
      .status(result.statusCode)
      .json({ status: "error", error: result.response.error });
  }
});

productsViewsRouter.get("/realTimeProducts", async (req, res) => {
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
    });
  } else {
    Z;
    res
      .status(result.statusCode)
      .json({ status: "error", error: result.response.error });
  }
});

export default productsViewsRouter