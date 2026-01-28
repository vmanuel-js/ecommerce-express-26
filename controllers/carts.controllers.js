import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

export const createCart = async (req, res) => {
  try {
    const nuevoCarrito = await CartModel.create({
      productos: [],
    });

    res.status(201).json({
      status: "success",
      message: "Carrito creado exitosamente",
      payload: nuevoCarrito,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Error al crear el carrito",
      details: error.message,
    });
  }
};

export const getCartById = async (req, res) => {
  try {
    const carrito = await CartModel.findById(req.params.cid).populate(
      "productos.product",
    );

    if (!carrito) {
      return res.status(404).json({
        status: "error",
        error: "Carrito no encontrado",
      });
    }

    res.json({
      status: "success",
      payload: carrito,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Error al obtener el carrito",
      details: error.message,
    });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const productExists = await ProductModel.findById(pid);
    if (!productExists)
      return res.status(404).json({ error: "Producto no existe" });

    const item = cart.productos.find((p) => p.product.toString() === pid);

    if (item) {
      item.quantity++;
    } else {
      cart.productos.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json({
      status: "success",
      message: "Producto agregado al carrito",
      payload: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Error al agregar producto al carrito",
      details: error.message,
    });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      res.status(400).json({
        error: "La cantidad debe ser un número mayor a 0",
      });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const productInCart = cart.productos.find(
      (p) => p.product.toString() === pid,
    );

    if (!productInCart)
      return res
        .status(404)
        .json({ error: "Producto no existe en el carrito" });

    productInCart.quantity = quantity;

    await cart.save();

    res.json({
      status: "success",
      message: "Cantidad actualizada",
      payload: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Error al actualizar cantidad",
      details: error.message,
    });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const initialLength = cart.productos.length;
    cart.productos = cart.productos.filter(
      (item) => item.product.toString() !== pid,
    );

    if (cart.productos.length === initialLength) {
      return res.status(404).json({
        status: "error",
        error: "Producto no encontrado en el carrito",
      });
    }

    await cart.save();
    res.json({
      status: "success",
      message: "Producto eliminado del carrito",
      payload: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Error al eliminar producto",
      details: error.message,
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { productos } = req.body;

    if (!Array.isArray(productos)) {
      return res.status(400).json({
        error:
          "Debes enviar un array en 'productos'. Ejemplo: { productos: [...] }",
      });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    for (const item of productos) {
      if (!item.product || !item.quantity) {
        return res.status(400).json({
          error:
            "Formato inválido. Cada elemento debe incluir 'product' y 'quantity'.",
        });
      }

      const prod = await ProductModel.findById(item.product);
      if (!prod) {
        return res
          .status(400)
          .json({ error: `Producto no existe: ${item.product}` });
      }
    }

    cart.productos = productos;
    await cart.save();

    res.json({
      status: "success",
      message: "Carrito actualizado",
      payload: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Error al actualizar carrito",
      details: error.message,
    });
  }
};

export const deleteAllProducts = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(400).json({ error: "Carrito no encontrado" });

    cart.productos = [];
    await cart.save();

    res.json({
      status: "success",
      message: "Carrito vaciado exitosamente",
      payload: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Error al vaciar carrito",
      details: error.message,
    });
  }
};
