import productManager from "./ProductosManager.js";

class CarritoManager {
  async obtenerCarrito() {
    try {
      const data = await fs.readFile(this.ruta, { encoding: "utf-8" });
      const jsonDato = JSON.parse(data);
      return jsonDato;
    } catch (error) {
      console.error("Hubo un error: ", error);
      return [];
    }
  }

  async crearCarrito() {
    const carrito = await this.obtenerCarrito();

    const nuevoCarro = {
      id: carrito.length ? carrito[carrito.length - 1].id + 1 : 1,
      productos: [],
    };

    carrito.push(nuevoCarro);
    await fs.writeFile(this.ruta, JSON.stringify(carrito, null, 2));
    return nuevoCarro;
  }

  async obtenerCarritoPorId(id) {
    const carritos = await this.obtenerCarrito();
    return carritos.find((c) => c.id === id);
  }

  async agregarProductoAlCarrito(cid, pid) {
    const carritos = await this.obtenerCarrito();
    const carrito = carritos.find((c) => c.id === cid);

    if (!carrito) {
      return null;
    }

    // Validar que exista el producto
    const productos = await productManager.obtenerProductos();
    const existeProducto = productos.find((p) => p.id === pid);

    if (!existeProducto) {
      return "No existe el producto";
    }

    // Ver si el producto existe
    const item = carrito.productos.find((p) => p.product == pid);

    if (item) {
      item.quantity++;
    } else {
      carrito.productos.push({ product: pid, quantity: 1 });
    }

    await fs.writeFile(this.ruta, JSON.stringify(carritos, null, 2));
    return carrito;
  }
}

export default new CarritoManager("carrito.json");
