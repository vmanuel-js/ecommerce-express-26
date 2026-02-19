import { ProductosRepository } from "../repository/products.repository.js";

class ProductsService {
  constructor() {
    this.repository = new ProductosRepository();
  }

  async getProducts(filtro = {}, opciones = {}) {
    return await this.repository.getProducts(filtro, opciones);
  }

  async getProductById(id) {
    const product = await this.repository.getProductById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  }

  async createProduct(productData) {
    if (!productData.title || !productData.code || !productData.price) {
      throw new Error("Faltan campos obligatorios");
    }

    const exists = await this.repository.getProductsBy({
      code: productData.code,
    });
    if (exists) {
      throw new Error("El código del producto ya existe");
    }

    productData.status = productData.status ?? true;
    productData.thumbnails = productData.thumbnails || [];

    return await this.repository.createProduct(productData);
  }

  async updateProduct(id, data) {
    const product = await this.repository.getProductById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    if (data.code && data.code !== product.code) {
      const exists = await this.repository.getProductsBy({ code: data.code });
      if (exists) {
        throw new Error("El código del producto ya existe");
      }
    }

    return await this.repository.updateProduct(id, data);
  }

  async deleteProduct(id) {
    const product = await this.repository.getProductById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return await this.repository.deleteProduct(id);
  }
}

export const productsService = new ProductsService();
