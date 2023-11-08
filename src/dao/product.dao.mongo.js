import productModel from "./product.scheema.js";
import cfg from "../config/config.js";

/*1
  me trae todos los productos con formato de paginación:
*/
export default class ProductMongoDAO {
     getAllProds = async() => await productModel.find().lean().exec()
     getProdById = async(id) => await productModel.findById(id).lean().exec()
     createProd = async(data) => await productModel.create(data)
     updateProd = async(id, data) => await productModel.findByIdAndUpdate(id, data, { returnDocument: 'after' })
     deleteProd = async(id) => await productModel.findByIdAndDelete(id)

     getAllProdsPaginate = async (req, res) => {
      try {
        const filterOptions = {};
        //instancio las variables según los queries (parámetros necesarios para el paginate):
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;

        const paginateOptions = { lean: true, limit, page };

        //(parámetros opcionales para el paginate):
        if (req.query.stock) filterOptions.stock = req.query.stock;
        if (req.query.category) filterOptions.category = req.query.category;

        //queries opcionales del sort según el precio:
        if (req.query.sort === "asc") paginateOptions.sort = { price: 1 };
        if (req.query.sort === "desc") paginateOptions.sort = { price: -1 };

        const result = await productModel.paginate(
          filterOptions,
          paginateOptions
        );

        //================================================================//
        //lógica de los enlaces prevPage y nextPage de mi pagination:
        //prevLink:
        let prevLink;
        if (!req.query.page) {
          prevLink = `http://${req.hostname}:${cfg.PORT}${req.originalUrl}&page${result.prevPage}`;
        } else {
          const modifiedUrl = req.originalUrl.replace(
            `page=${req.query.page}`,
            `page=${result.prevPage}`
          );
          prevLink = `http://${req.hostname}:${cfg.PORT}${modifiedUrl}`;
        }
        //nextLink:
        let nextLink;
        if (!req.query.page) {
          nextLink = `http://${req.hostname}:${cfg.PORT}${req.originalUrl}?&page=${result.nextPage}`;
        } else {
          const modifiedUrl = req.originalUrl.replace(
            `page=${req.query.page}`,
            `page=${result.nextPage}`
          );
          nextLink = `http://${req.hostname}:${cfg.PORT}${modifiedUrl}`;
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
    }}