import { ProductosDAO } from "../DAO/productos.dao.js";

export class ProductosRepository {
  constructor() {
    this.dao = new ProductosDAO();
  }

  async getProducts(filtro = {}, opciones = {}) {
    if (Object.keys(opciones).length > 0) {
      return await this.dao.paginate(filtro, opciones);
    }
    return await this.dao.get();
  }

  async getProductById(id) {
    return await this.dao.getById(id);
  }

  async getProductsBy(filtro) {
    return await this.dao.getBy(filtro);
  }

  async createProduct(productData) {
    return await this.dao.create(productData);
  }

  async updateProduct(id, data) {
    return await this.dao.update(id, data);
  }

  async deleteProduct(id) {
    return await this.dao.delete(id);
  }
}
