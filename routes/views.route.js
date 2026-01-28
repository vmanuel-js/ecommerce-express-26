import express from "express";
import { rootView } from "../controllers/root.controllers.js";

// Instancia de un router
const router = express.Router();

router.get("/", rootView);

export default router;
