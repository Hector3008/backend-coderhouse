import ticketModel from "./ticket.scheema.js";

export default class ticketMongoDao {
  getTicketById = async (id) => await ticketModel.findById(id).lean().exec();

  getAllTickets = async ()=> await ticketModel.find().lean().exec()

  createTicket = async (data) => await ticketModel.create(data);

  updateTicket = async (id, data) =>
    await ticketModel.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    });

    deleteTicket = async (id)=> await ticketModel.findByIdAndDelete(id)
}