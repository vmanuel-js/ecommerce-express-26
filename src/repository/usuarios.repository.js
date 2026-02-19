import { UsuariosDAO } from "../DAO/usuarios.dao.js";

export class UsuariosRepository {
  constructor() {
    this.dao = new UsuariosDAO();
  }

  async getUsers() {
    return await this.dao.get();
  }

  async getUserById(id) {
    return await this.dao.getBy({ _id: id });
  }

  async getUserByEmail(email) {
    return await this.dao.getBy({ email });
  }

  async getUserBy(filtro) {
    return await this.dao.getBy(filtro);
  }

  async createUser(userData) {
    return await this.dao.create(userData);
  }

  async updateUser(id, data) {
    return await this.dao.update(id, data);
  }

  async deleteUser(id) {
    return await this.dao.delete(id);
  }
}
