import express from "express";
import passport from "passport";
import { autorizar } from "../middlewares/auth.middleware.js";
import {
  getAllTickets,
  getTicketById,
  purchaseCart,
} from "../controllers/tickets.controllers.js";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("current", { session: false }),
  autorizar("admin"),
  getAllTickets,
);

router.get(
  "/:tid",
  passport.authenticate("current", { session: false }),
  getTicketById,
);

export default router;
