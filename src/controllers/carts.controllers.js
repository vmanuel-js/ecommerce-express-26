import { cartsService } from "../services/carts.service.js";

export const createCart = async (req, res) => {
  try {
    const nuevoCarrito = await cartsService.createCart();

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
    const carrito = await cartsService.getCartById(req.params.cid);

    res.json({
      status: "success",
      payload: carrito,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: "Error al obtener el carrito",
      details: error.message,
    });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const cart = await cartsService.addProductToCart(cid, pid, quantity);

    res.json({
      status: "success",
      message: "Producto agregado al carrito",
      payload: cart,
    });
  } catch (error) {
    res.status(400).json({
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

    const cart = await cartsService.updateProductQuantity(cid, pid, quantity);

    res.json({
      status: "success",
      message: "Cantidad actualizada",
      payload: cart,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: "Error al actualizar cantidad",
      details: error.message,
    });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await cartsService.removeProductFromCart(cid, pid);

    res.json({
      status: "success",
      message: "Producto eliminado del carrito",
      payload: cart,
    });
  } catch (error) {
    res.status(400).json({
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

    const cart = await cartsService.updateCart(cid, productos);

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

    const cart = await cartsService.clearCart(cid);

    res.json({
      status: "success",
      message: "Carrito vaciado exitosamente",
      payload: cart,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: "Error al vaciar carrito",
      details: error.message,
    });
  }
};
