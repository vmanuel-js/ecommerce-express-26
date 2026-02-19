import { CartsDAO } from "../DAO/carts.dao.js";

export class CartsRepository {
  constructor() {
    this.dao = new CartsDAO();
  }

  async getCarts() {
    return await this.dao.get();
  }

  async getCartById(id) {
    return await this.dao.getById(id);
  }

  async getCartBy(filtro) {
    return await this.dao.getBy(filtro);
  }

  async createCart(cartData) {
    return await this.dao.create(cartData);
  }

  async updateCart(id, data) {
    return await this.dao.update(id, data);
  }

  async deleteCart(id) {
    return await this.dao.delete(id);
  }
}
