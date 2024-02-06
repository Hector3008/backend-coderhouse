import { Router } from "express";
import {
  getUsersViewController as getUsers,
  formToDocumentsController as formToDocuments,
} from "../controllers/users.controller.js";
import { handlePolicies as hp } from "../../utils.js";
const usersViewRouter = Router();

usersViewRouter.get("/", hp(["admin"]), getUsers);
usersViewRouter.get("/formToDocuments", formToDocuments)
export default usersViewRouter