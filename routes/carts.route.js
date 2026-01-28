import express from "express";
import {
  addProductToCart,
  createCart,
  deleteAllProducts,
  deleteProductFromCart,
  getCartById,
  updateCart,
  updateProductQuantity,
} from "../controllers/carts.controllers.js";

const router = express.Router();

router.post("/", createCart);
router.get("/:cid", getCartById);
router.post("/:cid/product/:pid", addProductToCart);
router.put("/:cid/product/:pid", updateProductQuantity);
router.delete("/:cid/product/:pid", deleteProductFromCart);
router.put("/:cid", updateCart);
router.delete("/:cid", deleteAllProducts);

export default router;
