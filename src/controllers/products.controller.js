import cfg from "../config/config.js";
import {
  ProductService as Prod,
  UserService as User,
} from "../services/services.js";
import CustomError from "../services/errors/custom.error.js";
import EErros from "../services/errors/enums.js";
import { generateErrorInfo } from "../services/errors/info.js";
import mailer from "../config/mailer.config.js";
/*
para el catalogo de productos
*/
export const productsViewController = async (req, res) => {
  const result = await Prod.getAllPaginate(req, res);

  if (result.statusCode === 200) {
    const totalPages = [];
    let link;

    for (let index = 1; index <= result.response.totalPages; index++) {
      if (!req.query.page) {
        link = `http://${req.hostname}:${cfg.PORT}${req.originalUrl}?page=${index}`;
      } else {
        const modifiedUrl = req.originalUrl.replace(
          `page=${req.query.page}`,
          `page=${index}`
        );
        link = `http://${req.hostname}:${cfg.PORT}${modifiedUrl}`;
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
};
/*
para el storage del administrador:
*/
export const realTimeProductsController = async (req, res) => {
  const SEO = {
    title: "realTimeProducts",
  };
  /*
  consulto los productos en mi bdd de productos:*/
  const result = await Prod.getAllPaginate(req, res);
  if (result.statusCode === 200) {
    const totalPages = [];
    let link;

    for (let index = 1; index <= result.response.totalPages; index++) {
      if (!req.query.page) {
        link = `http://${req.hostname}:${cfg.PORT}${req.originalUrl}?page=${index}`;
      } else {
        const modifiedUrl = req.originalUrl.replace(
          `page=${req.query.page}`,
          `page=${index}`
        );
        link = `http://${req.hostname}:${cfg.PORT}${modifiedUrl}`;
      }
      totalPages.push({ page: index, link });
    }
    /*
    renderizo la plantilla realTimeProducts y le cargo el resultado de mi consulta a la bdd de productos:*/
    res.render("realTimeProducts.handlebars", {
      products: result.response.payload,
      SEO: SEO,
      user: req.session.user,
      paginateInfo: {
        hasPrevPage: result.response.hasPrevPage,
        hasNextPage: result.response.hasNextPage,
        prevLink: result.response.prevLink,
        nextLink: result.response.nextLink,
        totalPages,
      },
    });
  } else {
    res
      .status(result.statusCode)
      .json({ status: "error", error: result.response.error });
  }
};
/*
para la página particular de cada producto
*/
export const productViewController = async (req, res) => {
  const id = req.params.id;

  const product = await Prod.getById(id);

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
};
/*
 */
export const productsController = async (req, res) => {
  console.log("entré al router de products: ");
  const result = await Prod.getAllPaginate(req, res);

  res.status(result.statusCode).json(result.response);
};
/*
 */
export const productController = async (req, res) => {
  try {
    /*
    instancio las variables de acceso al id con el query param:*/
    const id = req.params.pid;
    /*
    consulto en la bdd de productos en mi cloud.mongo por un producto con ese id:*/
    const result = await Prod.getById(id);
    /*
    validación 1: producto con id presente en la bdd:*/
    if (result === null) {
      return res.status(404).json({ status: "error", error: "Not found" });
    }
    /*
    retorno la respuesta con el resultado de mi consulta en el payload:*/
    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err.message,
      test: "this is de catch message",
    });
  }
};
/*
 */
export const createProductController = async (req, res) => {
  try {
    const product = req.body;
    if (!product.title) {
      CustomError.createError({
        name: "product creation error",
        cause: generateErrorInfo(product),
        message: "Error trying to create a product",
        code: EErros.TITLE_FIELD_EMPTY,
      });
    }

    const result = await Prod.createProd(product);

    res.status(201).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err.message,
      test: "this is the catch error message",
    });
  }
};
/*
 */
export const updateProductController = async (req, res) => {
  try {
    /*
    instancio la variable de acceso al Id del producto desde el param:*/
    const id = req.params.pid;
    /*
    instancio la data desde el body:*/
    const data = req.body;
    /*
    actualizo*/
    const result = await Prod.updateProd(id, data);
    if (result === null) {
      return res.status(404).json({ status: "error", error: "Not found" });
    }

    const products = await Prod.getAll();
    try {
      req.io.emit("updatedProducts", products);
    } catch (err) {
      console.log(err);
    }

    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};
/*
 */
export const deleteProductController = async (req, res) => {
  const id = req.params.pid;
  const prodToDelete = await Prod.getById(id);

  if (prodToDelete === null) {
    return res
      .status(404)
      .json({ status: "error", error: "Product does not found" });
  }
  const owner = prodToDelete.owner;
  let products;
  let body = {
    intro: "tu producto ha sido eliminado satisfactoriamente",
    table: {
      data: [
        {
          prodToDelete,
        },
      ],
    },
    outro: "si crees que ha sido un error por favor comunicate con nosotros",
  };
  switch (req.session.user.role) {
    case "premium":
      if (req.session.user.email !== owner) {
        products = await Prod.getAll();
        return res.json({
          status: "error",
          error: "premium user can not delete this product",
          description:
            "un usuario ha querido eliminar un producto del que no es dueño",
          payload: products,
        });
      }    
      await mailer(
        owner,
        body,
        "<E-Commerce>",
        "has eliminado un producto de tu catalogo"
      );
      await Prod.deleteProd(id);
      break;
    case "admin":
      await mailer(
        owner,
        body,
        "<E-Commerce>",
        "has eliminado un producto de tu catalogo"
      );
      await Prod.deleteProd(id);
      break;
    default:
      break;
  }
  try {
    products = await Prod.getAll();
    res.status(200).json({ status: "success", payload: products });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err.message,
    });
  }
};

export const viewController = async(req, res)=>{
  res.status(200).json({message: "viewController"});
}
