import { PORT } from "../app.js";
import cartModel from "../dao/models/cart.model.js";

export const getCarts = async (req, res) => {
  try {
    const filterOptions = {};
    //instancio las variables según los queries (parámetros necesarios para el paginate):
    const limit = req.query.limit || 5;
    const page = req.query.page || 1;

    const paginateOptions = { lean: true, limit, page };

    const result = await cartModel.paginate(filterOptions, paginateOptions);
    console.log("consulta realizada con éxito");
    console.log(`el query page es: ${req.query.page}`);
    console.log(`el query limit es: ${req.query.limit}`);

    //================================================================//
    //lógica de los enlaces prevPage y nextPage de mi pagination:
    //prevLink:
    let prevLink;
    if (!req.query.page) {
      prevLink = `http://${req.hostname}:${PORT}${req.originalUrl}&page${result.prevPage}`;
    } else {
      const modifiedUrl = req.originalUrl.replace(
        `page=${req.query.page}`,
        `page=${result.prevPage}`
      );
      prevLink = `http://${req.hostname}:${PORT}${modifiedUrl}`;
    }
    //nextLink:
    let nextLink;
    if (!req.query.page) {
      nextLink = `http://${req.hostname}:${PORT}${req.originalUrl}?&page=${result.nextPage}`;
    } else {
      const modifiedUrl = req.originalUrl.replace(
        `page=${req.query.page}`,
        `page=${result.nextPage}`
      );
      nextLink = `http://${req.hostname}:${PORT}${modifiedUrl}`;
    }
    //armo el json de la response:
    return {
      statusCode: 200,
      response: {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? prevLink : null,
        nextLink: result.hasNextPage ? nextLink : null,
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      response: { status: "error", error: err.message },
    };
  }
};

export const getProductsFromCart = async (req, res) => {
  try {
    //instancio la variable de acceso al id del carrito desde el params:
    const id = req.params.cid;

    //consulto el carrito en la bdd de carritos con el populate de products para que me enseñe todos los productos:
    const result = await cartModel
      .findById(id)
      .populate("products.product")
      .lean();

    //validacion1: el carrito no existe en la bdd:
    if (result === null) {
      return {
        statusCode: 404,
        response: { status: "error", error: "Not found" },
      };
    }
    //finalmente, retorno la respuesta en el payload de mi json:
    return {
      statusCode: 200,
      response: { status: "success", payload: result },
    };
  } catch (err) {
    return {
      statusCode: 500,
      response: { status: "error", error: err.message },
    };
  }
};

