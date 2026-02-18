import CartModel from "../models/cart.model.js";
import { usuariosModelo } from "../models/usuarios.modelo.js";

export class UsuariosManagerMongo {
  async create(usuario) {
    let nuevoUsuario = await usuariosModelo.create(usuario);
    return nuevoUsuario;
  }

  async getAll() {
    return await usuariosModelo.find().populate("cart").lean();
  }

  async getBy(filtro) {
    return await usuariosModelo.findOne(filtro).populate("cart").lean();
  }

  async update(id, data) {
    return await usuariosModelo
      .findByIdAndUpdate(id, data, { new: true })
      .populate("cart")
      .lean();
  }

  async delete(id) {
    const usuario = await usuariosModelo.findById(id);
    if (usuario && usuario.cart) {
      await CartModel.findByIdAndDelete(usuario.cart);
    }
    return await usuariosModelo.findByIdAndDelete(id);
  }
}
