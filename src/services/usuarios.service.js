import { UsuariosRepository } from "../repository/usuarios.repository.js";
import { CartsRepository } from "../repository/carts.repository.js";

class UsuariosService {
  constructor() {
    this.usuariosRepository = new UsuariosRepository();
    this.cartsRepository = new CartsRepository();
  }

  async getUsers() {
    return await this.usuariosRepository.getUsers();
  }

  async getUserById(id) {
    return await this.usuariosRepository.getUserById(id);
  }

  async getUserByEmail(email) {
    return await this.usuariosRepository.getUserByEmail(email);
  }

  async getUserBy(filtro) {
    return await this.usuariosRepository.getUserBy(filtro);
  }

  async createUser(userData) {
    return await this.usuariosRepository.createUser(userData);
  }

  async updateUser(id, data) {
    return await this.usuariosRepository.updateUser(id, data);
  }

  async deleteUser(id) {
    const usuario = await this.usuariosRepository.getUserById(id);

    if (usuario && usuario.cart) {
      await this.cartsRepository.deleteCart(usuario.cart);
    }
    return await this.usuariosRepository.deleteUser(id);
  }
}

export const usuariosService = new UsuariosService();
