import passport from "passport";
import express from "express";
import { soloAdmin } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/products.controllers.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post(
  "/",
  passport.authenticate("current", { session: false }),
  soloAdmin,
  createProduct,
);
router.get("/:pid", getProductById);
router.put(
  "/:pid",
  passport.authenticate("current", { session: false }),
  soloAdmin,
  updateProduct,
);
router.delete(
  "/:pid",
  passport.authenticate("current", { session: false }),
  soloAdmin,
  deleteProduct,
);

export default router;