import { Router } from "express";
import {
  getTicketsController as tickets,
  getTicketController as ticket,
  createTicketController as createTicket,
  updateTicketController as updateTicket,
  deleteTicketController as deleteTicket,
} from "../controllers/tickets.controller.js";
import { handlePolicies as hp } from "../../utils.js";
const ticketsRouter = Router();

ticketsRouter.get("/alltickets", hp(["admin", "premium", "user"]), tickets);
ticketsRouter.get("/:tid", hp(["admin", "premium", "user"]), ticket);
ticketsRouter.post(
  "/cart/:cid",
  hp(["admin", "premium", "user"]),
  createTicket
);
ticketsRouter.put("/:tid", hp(["admin", "premium", "user"]), updateTicket);
ticketsRouter.delete("/:tid", hp(["admin", "premium", "user"]), deleteTicket);

export default ticketsRouter;