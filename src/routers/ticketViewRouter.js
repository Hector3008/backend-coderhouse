import { Router } from "express";
import { getTicketViewController as ticketView, getTicketsViewController as ticketsView } from "../controllers/tickets.controller.js";
const ticketsViewRouter = Router();
ticketsViewRouter.get("/", ticketsView);
ticketsViewRouter.get("/faillure", async(req,res)=>{res.render("canceled.handlebars", {user: req.session.user})})
ticketsViewRouter.get("/:tid", ticketView);
export default ticketsViewRouter;