import TicketModel from "../models/ticket.model.js";

export class TicketsDAO {
  async get() {
    return await TicketModel.find().populate("products.product").lean();
  }

  async getById(id) {
    return await TicketModel.findById(id).populate("products.product").lean();
  }

  async getBy(filtro) {
    return await TicketModel.findOne(filtro)
      .populate("products.product")
      .lean();
  }

  async create(ticket) {
    return await TicketModel.create(ticket);
  }
}
