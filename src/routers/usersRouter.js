import { Router } from "express";
//import { updateToPremiumController as updateToPremium,} from "../controllers/sessions.controller.js";
import {
  updateToPremiumController as updateToPremium,
  getUsersController as getUsers,
  createDocumentsController as createDocument,
} from "../controllers/users.controller.js";
import { uploader } from "../middlewares/multer.middleware.js";

const userRouter = Router()
userRouter.get("/",getUsers)
userRouter.get("/:uid/documents")
userRouter.post("/documents", uploader.any(), createDocument);
userRouter.post("/:uid/premium", updateToPremium)

export default userRouter