import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { UsuariosManagerMongo } from "../managers/UsuariosManager.Mongo.js";

export const router = Router();
const usuariosManager = new UsuariosManagerMongo();

const auth = (req, res, next) => {
  passport.authenticate("current", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: `No autorizado` });
    }
    req.user = user;
    next();
  })(req, res, next);
};

router.get("/error", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(400).json({ error: `Error al autenticar` });
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/error",
    session: false,
  }),
  async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res
      .status(201)
      .json({ message: `Registro exitoso`, nuevoUsuario: req.user });
  },
);

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/error",
    session: false,
  }),
  async (req, res) => {
    let { user: usuario } = req;
    let token = jwt.sign(usuario, config.SECRET, { expiresIn: "1h" });
    res.cookie("cookieToken", token, { httpOnly: true });
    res.setHeader("Content-Type", "application/json");
    return res
      .status(200)
      .json({ message: `Login exitoso`, usuarioLogueado: usuario });
  },
);

router.get(
  "/current",
  passport.authenticate("current", {
    failureRedirect: "/api/sessions/error",
    session: false,
  }),
  (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ payload: req.user });
  },
);

router.post("/logout", (req, res) => {
  res.clearCookie("cookieToken");
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ message: "Logout exitoso" });
});

// CRUD
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Acceso denegado. Solo administradores pueden ver los usuarios",
      });
    }

    const usuarios = await usuariosManager.getAll();

    const usuariosSinPasswords = usuarios.map((user) => {
      const { password, ...userSinPassword } = user;
      return userSinPassword;
    });

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ usuarios: usuariosSinPasswords });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(500)
      .json({ error: "Error al obtener usuarios", detalle: error.message });
  }
});

router.get("/:uid", auth, async (req, res) => {
  try {
    const { uid } = req.params;

    if (req.user._id !== uid && req.user.role !== "admin") {
      return res.status(403).json({
        error: "Acceso denegado. Solo puedes ver tu propia información",
      });
    }

    const usuario = await usuariosManager.getBy({ _id: uid });

    if (!usuario) {
      return res.status(404).json({
        error: `Usuario con id ${uid} no encontrado`,
      });
    }

    const { password, ...usuarioSinPassword } = usuario;

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ usuarios: usuarioSinPassword });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(500)
      .json({ error: "Error al obtener usuario", detalle: error.message });
  }
});

router.put("/:uid", auth, async (req, res) => {
  try {
    const { uid } = req.params;

    if (req.user._id !== uid && req.user.role !== "admin") {
      return res.status(403).json({
        error: "Acceso denegado. Solo puedes ver tu propia información",
      });
    }

    const { first_name, last_name, age, email, role } = req.body;

    if (req.body.password) {
      return res.status(400).json({
        error: `No se puede actualizar la contraseña por esta vía`,
      });
    }

    if (role && req.user.role !== "admin") {
      return res.status(403).json({
        error: "Solo administradores pueden cambiar roles",
      });
    }

    const datosActualizar = {};
    if (first_name) datosActualizar.first_name = first_name;
    if (last_name) datosActualizar.last_name = last_name;
    if (age) datosActualizar.age = age;
    if (email) datosActualizar.email = email;
    if (role && req.user.role === "admin") datosActualizar.role = role;

    const usuarioActualizado = await usuariosManager.update(
      uid,
      datosActualizar,
    );

    if (!usuarioActualizado) {
      return res.status(404).json({
        error: `Usuario con id ${uid} no encontrado`,
      });
    }

    const { password, ...usuarioSinPassword } = usuarioActualizado;

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      message: "Usuario actualizado exitosamente",
      usuario: usuarioSinPassword,
    });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(500)
      .json({ error: "Error al actualizar usuario", detalle: error.message });
  }
});

router.delete("/:uid", auth, async (req, res) => {
  try {
    const { uid } = req.params;

    if (req.user._id !== uid && req.user.role !== "admin") {
      return res.status(403).json({
        error: "Acceso denegado. Solo puedes eliminar tu propia cuenta",
      });
    }

    const usuarioEliminado = await usuariosManager.delete(uid);

    if (!usuarioEliminado) {
      return res.status(404).json({
        error: `Usuario con id ${uid} no encontrado`,
      });
    }

    if (req.user._id === uid) {
      res.clearCookie("cookieToken");
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(500)
      .json({ error: "Error al eliminar usuario", detalle: error.message });
  }
});
