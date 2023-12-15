import mongoose from "mongoose";

/*CP means ChangePassaword */

const CPSolitudeScheema = new mongoose.Schema({
  email: { type: String, ref: "users" },
  token: { type: String, required: true },
  isUsed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expireAfterSeconds: 3600 },
});

mongoose.set("strictQuery", false);
const UserPasswordModel = mongoose.model("CPSolitudes", CPSolitudeScheema);

export default UserPasswordModel;
