import cartModeL from "../dao/models/cart.model.js";

const getProductsFromCart = async (req, res) => {
  try {
    //instancio la variable de acceso al id del carrito desde el params:
    const id = req.params.cid;

    //consulto el carrito en la bdd de carritos con el populate de products para que me enseñe todos los productos:
    const result = await cartModeL
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

export default getProductsFromCart