import mongoose from "mongoose";

/*CP means ChangePassaword */

const CPSolitudeScheema = new mongoose.Schema({
  email: { type: String, ref: "users" },
  code: { type: String, required: true },
  isUsed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

mongoose.set("strictQuery", false);
const CPSolitudeModel  = mongoose.model("CPSolitudes", CPSolitudeScheema);

export default CPSolitudeModel;