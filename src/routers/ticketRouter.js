import { Router } from "express";
import {
  getTicketsController as tickets,
  getTicketController as ticket,
  createTicketController as createTicket,
  updateTicketController as updateTicket,
  deleteTicketController as deleteTicket,
} from "../controllers/tickets.controller.js";

const ticketsRouter = Router();

ticketsRouter.get("/alltickets", tickets);
ticketsRouter.get("/:tid", ticket);
ticketsRouter.post("/cart/:cid", createTicket);
ticketsRouter.put("/:tid", updateTicket);
ticketsRouter.delete("/:tid",deleteTicket)


export default ticketsRouter;