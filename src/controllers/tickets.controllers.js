import { ticketsService } from "../services/tickets.service.js";

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketsService.getTickets();

    res.json({
      status: "success",
      payload: tickets,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await ticketsService.getTicketById(req.params.tid);

    res.json({
      status: "success",
      payload: ticket,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const userEmail = req.user.email;

    if (req.user.cart.toString() !== cid) {
      return res.status(403).json({
        status: "error",
        error: "Este carrito no pertenece al usuario logueado",
      });
    }

    const result = await ticketsService.purchaseCart(cid, userEmail);

    if (result.productosSinStock.length > 0) {
      return res.status(200).json({
        status: "success",
        message:
          "Compra realizada parcialmente. Algunos productos no tenían stock suficiente",
        ticket: result.ticket,
        productosSinStock: result.productosSinStock,
      });
    }

    res.status(201).json({
      status: "success",
      message: "Compra realizada exitosamente",
      ticket: result.ticket,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};
