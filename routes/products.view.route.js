import express from "express";
import { productsView } from "../controllers/viewProducts.controllers.js";

const router = express.Router();

router.get("/", productsView);

export default router;
