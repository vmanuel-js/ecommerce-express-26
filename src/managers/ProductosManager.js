import ProductModel from "../models/product.model.js";

class ProductosManager {
  // Leer todos los productos
  async obtenerProductos() {
    try {
      return await ProductModel.find().lean();
    } catch (error) {
      console.error("Error al obtener productos: ", error);
      return [];
    }
  }

  // Obtener productos por ID
  async obtenerProductosPorId(id) {
    try {
      return await ProductModel.findById(id).lean();
    } catch (error) {
      console.error("Error al obtener producto por ID: ", error);
      return null;
    }
  }

  async obtenerProductoPorId(id) {
    return this.obtenerProductosPorId(id);
  }

  // Agregar un nuevo producto
  async agregarProducto(productoData) {
    try {
      const nuevoProducto = await ProductModel.create({
        ...productoData,
        status: productoData.status ?? true,
        thumbnails: productoData.thumbnails || [],
      });
      return nuevoProducto;
    } catch (error) {
      console.error("Error al agregar producto:", error);
      throw error;
    }
  }

  async actualizarProducto(id, field) {
    try {
      const productoActualizado = await ProductModel.findByIdAndUpdate(
        id,
        field,
        { new: true },
      ).lean();
      return productoActualizado;
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      return null;
    }
  }

  async eliminarProducto(id) {
    try {
      const eliminado = await ProductModel.findByIdAndDelete(id);
      return !!eliminado;
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      return false;
    }
  }
}

export default new ProductosManager();
