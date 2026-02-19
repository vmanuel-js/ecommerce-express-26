import { CartsRepository } from "../repository/carts.repository.js";
import { ProductosRepository } from "../repository/products.repository.js";

class CartsService {
  constructor() {
    this.cartsRepository = new CartsRepository();
    this.productsRepository = new ProductosRepository();
  }

  async getCarts() {
    return await this.cartsRepository.getCarts();
  }

  async getCartById(id) {
    const cart = await this.cartsRepository.getCartById(id);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    return cart;
  }

  async createCart() {
    return await this.cartsRepository.createCart({ productos: [] });
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const product = await this.productsRepository.getProductById(productId);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    const cart = await this.cartsRepository.getCartById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const productIndex = cart.productos.findIndex(
      (p) => p.product._id.toString() === productId.toString(),
    );

    if (productIndex > -1) {
      cart.productos[productIndex].quantity += quantity;
    } else {
      cart.productos.push({ product: productId, quantity });
    }

    return await this.cartsRepository.updateCart(cartId, {
      productos: cart.productos,
    });
  }

  async updateProductQuantity(cartId, productId, quantity) {
    if (quantity < 1) {
      throw new Error("La cantidad debe ser mayor a 0");
    }

    const cart = await this.cartsRepository.getCartById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const productInCart = cart.productos.find(
      (p) => p.product._id.toString() === productId.toString(),
    );

    if (!productInCart) {
      throw new Error("Producto no encontrado en el carrito");
    }

    productInCart.quantity = quantity;

    return await this.cartsRepository.updateCart(cartId, {
      productos: cart.productos,
    });
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await this.cartsRepository.getCartById(cartId);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const initialLength = cart.productos.length;
    cart.productos = cart.productos.filter(
      (item) => item.product._id.toString() !== productId.toString(),
    );

    if (cart.productos.length === initialLength) {
      throw new Error("Producto no encontrado en el carrito");
    }

    return await this.cartsRepository.updateCart(cartId, {
      productos: cart.productos,
    });
  }

  async updateCart(cartId, productos) {
    if (!Array.isArray(productos)) {
      throw new Error("Productos debe ser un array");
    }

    const cart = await this.cartsRepository.getCartById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    for (const item of productos) {
      if (!item.product || !item.quantity) {
        throw new Error(
          "Formato inválido. Cada elemento debe incluir 'product' y 'quantity'",
        );
      }

      const prod = await this.productsRepository.getProductById(item.product);
      if (!prod) {
        throw new Error(`Producto no existe: ${item.product}`);
      }
    }

    return await this.cartsRepository.updateCart(cartId, { productos });
  }

  async clearCart(cartId) {
    const cart = await this.cartsRepository.getCartById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    return await this.cartsRepository.updateCart(cartId, { productos: [] });
  }

  async deleteCart(id) {
    return await this.cartsRepository.deleteCart(id);
  }
}

export const cartsService = new CartsService();
