import { TicketsDAO } from "../DAO/tickets.dao.js";

export class TicketsRepository {
  constructor() {
    this.dao = new TicketsDAO();
  }

  async getTickets() {
    return await this.dao.get();
  }

  async getTicketById(id) {
    return await this.dao.getById(id);
  }

  async getTicketBy(filtro) {
    return await this.dao.getBy(filtro);
  }

  async createTicket(ticketData) {
    return await this.dao.create(ticketData);
  }
}
