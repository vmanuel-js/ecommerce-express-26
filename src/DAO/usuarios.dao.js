import { usuariosModelo } from "../models/usuarios.modelo.js";

export class UsuariosDAO {
  async get() {
    return await usuariosModelo.find().lean();
  }

  async getBy(filtro) {
    return await usuariosModelo.findOne(filtro).populate("cart").lean();
  }

  async create(usuario) {
    return await usuariosModelo.create(usuario);
  }

  async update(id, data) {
    return await usuariosModelo
      .findByIdAndUpdate(id, data, { new: true })
      .populate("cart")
      .lean();
  }

  async delete(id) {
    return await usuariosModelo.findByIdAndDelete(id);
  }
}
