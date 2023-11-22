import mongoose from "mongoose";
import { generateRandomCode } from "../../utils.js";


const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      default: generateRandomCode,
    },

    products: {
      type: [
        {
          _id: false,
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
          },
          price: Number,
          quantity: Number,
        },
      ],
    },
    amount: { type: Number },

    purchaser: { type: String, ref: "users" },
  },
  {
    timestamps: {
      createdAt: "purchase_datetime",
    },
  }
);

mongoose.set("strictQuery", false);
const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;
