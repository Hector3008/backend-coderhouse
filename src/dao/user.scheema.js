import mongoose from "mongoose";

const userCollection = "users";

const userScheema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  age: { type: Number, default: 21 },
  password: { type: String },
  role: { type: String, enum: ['user', 'admin', 'premium'], default: 'user' },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
  documents: {type: Array, default: []},
  last_connection: {type: Date, default: Date.now}
});

mongoose.set("strictQuery", false);

const userModel2 = mongoose.model(userCollection, userScheema);

export default userModel2;
