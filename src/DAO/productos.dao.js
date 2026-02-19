import ProductModel from "../models/product.model.js";

export class ProductosDAO {
  async get() {
    return await ProductModel.find().lean();
  }

  async getBy(filtro) {
    return await ProductModel.findOne(filtro).lean();
  }

  async getById(id) {
    return await ProductModel.findById(id).lean();
  }

  async create(product) {
    return await ProductModel.create(product);
  }

  async update(id, data) {
    return await ProductModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }

  async paginate(filtro, opciones) {
    return await ProductModel.paginate(filtro, opciones);
  }
}
