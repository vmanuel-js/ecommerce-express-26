import { Router } from "express";
import passport from "passport";

export const router = Router();

router.get("/", (req, res) => {
  res.status(200).render("home");
});

router.get("/register", (req, res) => {
  res.status(200).render("registro");
});

router.get("/login", (req, res) => {
  res.status(200).render("login");
});

router.get(
  "/current",
  passport.authenticate("current", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    let { first_name, last_name, age, email, cart } = req.user;

    res.status(200).render("current", {
      first_name,
      last_name,
      age,
      email,
      cartId: cart?._id || cart,
    });
  },
);
