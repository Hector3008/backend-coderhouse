import { Router } from "express";
import { generaterProductsController as generateProducts } from "../controllers/users.generator.Controller.js";

const router = Router();

router.get("/", generateProducts);

export default router;
