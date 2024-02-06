import { Router } from "express";
//import { updateToPremiumController as updateToPremium,} from "../controllers/sessions.controller.js";
import {
  updateToPremiumController as updateToPremium,
  getUsersController as getUsers,
  createDocumentsController as createDocument,
  deleteUsersController as deleteUsers,
  getUsersViewController as getUsersView,
  deleteUserController as deleteUser,
} from "../controllers/users.controller.js";
import { uploader } from "../middlewares/multer.middleware.js";

const userRouter = Router()
userRouter.get("/",getUsers)
userRouter.get("/view", getUsersView);
userRouter.delete("/",deleteUsers);

userRouter.delete("/:uid", deleteUser);
userRouter.get("/:uid/documents")
userRouter.post("/documents", uploader.any(), createDocument);
userRouter.get("/:uid/premium", updateToPremium)

export default userRouter