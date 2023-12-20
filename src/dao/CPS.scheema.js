import mongoose from "mongoose";

/*CPS means ChangePassawordSolicitude */

const CPSScheema = new mongoose.Schema({
  email: { type: String, ref: "users" },
  code: { type: String, required: true },
  isUsed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

mongoose.set("strictQuery", false);
const CPSModel = mongoose.model("CPS", CPSScheema);

export default CPSModel;