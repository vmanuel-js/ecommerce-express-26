import { CartsRepository } from "../repository/carts.repository.js";
import { ProductosRepository } from "../repository/products.repository.js";
import { TicketsRepository } from "../repository/tickets.repository.js";
import { v4 as uuidv4 } from "uuid";

class TicketsService {
  constructor() {
    this.ticketsRepository = new TicketsRepository();
    this.cartsRepository = new CartsRepository();
    this.productsRepository = new ProductosRepository();
  }

  async getTickets() {
    return await this.ticketsRepository.getTickets();
  }

  async getTicketById(id) {
    return await this.ticketsRepository.getTicketById(id);
  }

  async purchaseCart(cartId, userEmail) {
    const cart = await this.cartsRepository.getCartById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    if (!cart.productos || cart.productos.length === 0) {
      throw new Error("El carrito está vacío");
    }

    const productosComprados = [];
    const productosSinStock = [];
    let totalAmount = 0;

    for (const item of cart.productos) {
      const producto = await this.productsRepository.getProductById(
        item.product._id,
      );

      if (!producto) {
        productosSinStock.push(item);
        continue;
      }

      if (producto.stock >= item.quantity) {
        productosComprados.push({
          product: producto._id,
          quantity: item.quantity,
          price: producto.price,
        });

        totalAmount += producto.price * item.quantity;

        await this.productsRepository.updateProduct(producto._id, {
          stock: producto.stock - item.quantity,
        });
      } else {
        productosSinStock.push(item);
      }
    }

    if (productosComprados.length === 0) {
      throw new Error(
        "No hay stock disponible para ningún producto del carrito",
      );
    }

    const code = uuidv4();

    const ticket = await this.ticketsRepository.createTicket({
      code,
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: userEmail,
      products: productosComprados,
    });

    await this.cartsRepository.updateCart(cartId, {
      productos: productosSinStock,
    });

    return {
      ticket,
      productosSinStock,
    };
  }
}

export const ticketsService = new TicketsService();
