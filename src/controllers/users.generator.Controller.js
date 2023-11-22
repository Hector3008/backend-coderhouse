import { generateProducts } from "../mocking/generator.products.js";

export const generaterProductsController = (req, res) => {
  try {
    const users = generateProducts();
    res.json({ payload: users });
  } catch (err) {
    res.json({ status: "error", error: err });
  }
};
