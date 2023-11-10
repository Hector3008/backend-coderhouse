import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

//instancio el scheema:
const cartScheema = mongoose.Schema({
  products: {
    type: [
      {
        //_id: false es para que no se genere otro ID:
        _id: false,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: { type: Number, default: 1 },
      },
    ],
    default: [],
  },
});

//flexibilizo las consultas a este modelo con la siguiente línea:
mongoose.set("strictQuery", false);
cartScheema.plugin(mongoosePaginate);

const cartModel2 = mongoose.model("cart", cartScheema);

export default cartModel2;
