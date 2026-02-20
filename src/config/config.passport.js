import passport from "passport";
import passportJWT from "passport-jwt";
import local from "passport-local";
import { config } from "./config.js";
import { createHash, validaPass } from "../utils.js";
import { usuariosService } from "../services/usuarios.service.js";
import { cartsService } from "../services/carts.service.js";

const buscarToken = (req) => {
  let token = null;

  if (req.cookies.cookieToken) {
    token = req.cookies.cookieToken;
  }

  return token;
};

export const inicializarPassport = () => {
  passport.use(
    "register",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        let { first_name, last_name, age } = req.body;

        if (!first_name || !last_name || !age) {
          return done(null, false);
        }

        try {
          const email =
            typeof username === "string"
              ? username
              : username.username || req.body.email;

          let existe = await usuariosService.getUserByEmail(email);
          if (existe) {
            return done(null, false);
          }

          password = createHash(password);

          const nuevoCarrito = await cartsService.createCart();

          let nuevoUsuario = await usuariosService.createUser({
            first_name,
            last_name,
            email: email,
            age,
            password,
            cart: nuevoCarrito._id,
          });

          return done(null, nuevoUsuario);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    "login",
    new local.Strategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const email =
            typeof username === "string"
              ? username
              : username.username || req.body.email;
          let usuario = await usuariosService.getUserByEmail(email);
          if (!usuario) {
            return done(null, false);
          }

          if (!validaPass(password, usuario.password)) {
            return done(null, false);
          }

          delete usuario.password;

          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    "current",
    new passportJWT.Strategy(
      {
        secretOrKey: config.SECRET,
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([buscarToken]),
      },
      async (usuario, done) => {
        try {
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
};
