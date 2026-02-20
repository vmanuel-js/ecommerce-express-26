import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { usuariosService } from "../services/usuarios.service.js";
import { UsuarioDTO } from "../DTO/usuarios.dto.js";
import { autorizar } from "../middlewares/auth.middleware.js";

export const router = Router();

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

    const usuarioDTO = new UsuarioDTO(req.user);

    res
      .status(201)
      .json({ message: `Registro exitoso`, nuevoUsuario: usuarioDTO });
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

    const payload = {
      _id: usuario._id,
      first_name: usuario.first_name,
      last_name: usuario.last_name,
      email: usuario.email,
      age: usuario.age,
      role: usuario.role,
      cart: usuario.cart,
    };

    let token = jwt.sign(payload, config.SECRET, { expiresIn: "1h" });
    res.cookie("cookieToken", token, { httpOnly: true });

    const usuarioDTO = new UsuarioDTO(usuario);

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      message: `Login exitoso`,
      usuarioLogueado: usuarioDTO,
      cartId: usuarioDTO.cart,
    });
  },
);

router.get(
  "/current",
  passport.authenticate("current", {
    failureRedirect: "/api/sessions/error",
    session: false,
  }),
  (req, res) => {
    const usuarioDTO = new UsuarioDTO(req.user);

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ payload: usuarioDTO });
  },
);

router.post("/logout", (req, res) => {
  res.clearCookie("cookieToken");
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ message: "Logout exitoso" });
});

// CRUD
router.get(
  "/",
  passport.authenticate("current", { session: false }),
  autorizar("admin"),
  async (req, res) => {
    try {
      const usuarios = await usuariosService.getUsers();
      const usuarioDTO = usuarios.map((user) => new UsuarioDTO(user));

      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ usuarios: usuarioDTO });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ error: "Error al obtener usuarios", detalle: error.message });
    }
  },
);

router.get(
  "/:uid",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const { uid } = req.params;

      if (req.user._id.toString() !== uid && req.user.role !== "admin") {
        return res.status(403).json({
          error: "Acceso denegado. Solo puedes ver tu propia información",
        });
      }

      const usuario = await usuariosService.getUserById(uid);

      if (!usuario) {
        return res.status(404).json({
          error: `Usuario con id ${uid} no encontrado`,
        });
      }

      const usuarioDTO = new UsuarioDTO(usuario);

      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ usuarios: usuarioDTO });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ error: "Error al obtener usuario", detalle: error.message });
    }
  },
);

router.put(
  "/:uid",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const { uid } = req.params;

      if (req.user._id.toString() !== uid && req.user.role !== "admin") {
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

      const usuarioActualizado = await usuariosService.updateUser(
        uid,
        datosActualizar,
      );

      if (!usuarioActualizado) {
        return res.status(404).json({
          error: `Usuario con id ${uid} no encontrado`,
        });
      }

      const usuarioDTO = new UsuarioDTO(usuarioActualizado);

      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({
        message: "Usuario actualizado exitosamente",
        usuario: usuarioDTO,
      });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ error: "Error al actualizar usuario", detalle: error.message });
    }
  },
);

router.delete(
  "/:uid",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const { uid } = req.params;

      if (req.user._id.toString() !== uid && req.user.role !== "admin") {
        return res.status(403).json({
          error: "Acceso denegado. Solo puedes eliminar tu propia cuenta",
        });
      }

      const usuarioEliminado = await usuariosService.deleteUser(uid);

      if (!usuarioEliminado) {
        return res.status(404).json({
          error: `Usuario con id ${uid} no encontrado`,
        });
      }

      if (req.user._id.toString() === uid) {
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
  },
);
