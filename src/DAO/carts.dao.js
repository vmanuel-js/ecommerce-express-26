import CartModel from "../models/cart.model.js";

export class CartsDAO {
  async get() {
    return await CartModel.find().populate("productos.product").lean();
  }

  async getBy(filtro) {
    return await CartModel.findOne(filtro).populate("productos.product").lean();
  }

  async getById(id) {
    return await CartModel.findById(id).populate("productos.product").lean();
  }

  async create(cart) {
    return await CartModel.create(cart);
  }

  async update(id, data) {
    return await CartModel.findByIdAndUpdate(id, data, { new: true })
      .populate("productos.product")
      .lean();
  }

  async delete(id) {
    return await CartModel.findByIdAndDelete(id);
  }
}
