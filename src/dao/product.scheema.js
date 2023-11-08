import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

//schema (plantilla):
const productSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  thumbnail: { type: [String], default: [] },
  code: { type: String, unique: true, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
});

//flexibilizo las consultas a este modelo con la siguiente línea:
mongoose.set("strictQuery", false);

productSchema.plugin(mongoosePaginate);
//modelo:
const productModel2 = mongoose.model("product", productSchema);
//exportación:

export default productModel2;
