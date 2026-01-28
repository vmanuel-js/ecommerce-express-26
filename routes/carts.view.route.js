import express from "express";
import { cartView } from "../controllers/viewCarts.controllers.js";

const router = express.Router();

router.get("/", (req, res) => {
  const { cid } = req.query;

  if (cid) {
    return res.redirect(`/carts/${cid}`);
  }

  res.render("cartsIndex");
});
router.get("/:cid", cartView);

export default router;
