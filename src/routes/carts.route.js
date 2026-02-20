import passport from "passport";
import express from "express";
import { soloUser } from "../middlewares/auth.middleware.js";

import {
  addProductToCart,
  createCart,
  deleteAllProducts,
  deleteProductFromCart,
  getCartById,
  updateCart,
  updateProductQuantity,
} from "../controllers/carts.controllers.js";

import { purchaseCart } from "../controllers/tickets.controllers.js";

const router = express.Router();

router.post("/", createCart);
router.get("/:cid", getCartById);

router.post(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  soloUser,
  addProductToCart,
);

router.put(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  soloUser,
  updateProductQuantity,
);

router.delete(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  soloUser,
  deleteProductFromCart,
);

router.put(
  "/:cid",
  passport.authenticate("current", { session: false }),
  soloUser,
  updateCart,
);

router.delete(
  "/:cid",
  passport.authenticate("current", { session: false }),
  soloUser,
  deleteAllProducts,
);

router.post(
  "/:cid/purchase",
  passport.authenticate("current", { session: false }),
  soloUser,
  purchaseCart,
);

export default router;
