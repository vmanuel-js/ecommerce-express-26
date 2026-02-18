import { Router } from "express";
import passport from "passport";

export const router = Router();

router.get("/register", (req, res) => {
  res.status(200).render("register");
});

router.get("/login", (req, res) => {
  let { mensaje } = req.query;
  res.status(200).render("login", { mensaje });
});

router.get(
  "/current",
  passport.authenticate("current", {
    failureRedirect: "/auth/login",
    session: false,
  }),
  (req, res) => {
    let { first_name, last_name, age, email, role, cart } = req.user;

    res.status(200).render("current", {
      first_name,
      last_name,
      age,
      email,
      role,
      cart,
    });
  },
);
