import CartModel from "../models/cart.model.js";

export const cartView = async (req, res) => {
  try {
    const { cid } = req.params;

    const carrito = await CartModel.findById(cid).populate("productos.product");

    if (!carrito) {
      return res.render("cart", {
        error: "Carrito no encontrado",
        cart: null,
      });
    }

    const productosEnriquecidos = carrito.productos.map((item) => ({
      _id: item.product._id,
      title: item.product.title,
      description: item.product.description,
      price: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
    }));

    const total = productosEnriquecidos.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );

    res.render("cart", {
      cart: {
        id: carrito._id,
        productos: productosEnriquecidos,
        total: total.toFixed(2),
      },
      error: null,
    });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.render("cart", {
      error: "Error al cargar el carrito: " + error.message,
      cart: null,
    });
  }
};
