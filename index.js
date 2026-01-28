import express from "express";
import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import __dirname from "./utils.js";
import { config } from "./config/config.js";
import { engine } from "express-handlebars";

// Managers
import ProductosManager from "./managers/ProductosManager.js";

// Passport
import { inicializarPassport } from "./config/config.passport.js";
import passport from "passport";

// Routers
import { router as VistasRouter } from "./routes/vistas.router.js";
import { router as UsuariosRouter } from "./routes/usuarios.router.js";
import productsRouter from "./routes/products.route.js";
import cartsRouter from "./routes/carts.route.js";
import productsViewRouter from "./routes/products.view.route.js";
import cartsViewRouter from "./routes/carts.view.route.js";
import realtimeRouter from "./routes/realtime.route.js";

if (!config.MONGO_URL) {
  console.error("❌ ERROR: MONGO_URL no está configurada");
  console.error("Por favor, crea un archivo .env basándote en .env.example");
  process.exit(1);
}

const PORT = config.PORT;
const app = express();
const servidor = http.createServer(app);
const servidorWS = new Server(servidor);

//Websockets
servidorWS.on("connection", async (socket) => {
  console.log("Cliente conectado a Websocket");

  socket.emit("listaProductos", await ProductosManager.obtenerProductos());

  socket.on("nuevoProducto", async (data) => {
    await ProductosManager.agregarProducto(data);
    servidorWS.emit(
      "listaProductos",
      await ProductosManager.obtenerProductos(),
    );
  });

  socket.on("eliminarProducto", async (pid) => {
    await ProductosManager.eliminarProducto(pid);
    servidorWS.emit(
      "listaProductos",
      await ProductosManager.obtenerProductos(),
    );
  });
});

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar passport
inicializarPassport();
app.use(passport.initialize());

// Handlebars
app.engine(
  "handlebars",
  engine({
    layoutDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    defaultLayout: "main",
  }),
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));

// Rutas api
app.use("/api/sessions", UsuariosRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas Vistas
app.use("/", VistasRouter);
app.use("/products", productsViewRouter);
app.use("/carts", cartsViewRouter);
app.use("/realtimeproducts", realtimeRouter);

// Global error handling
app.use((err, req, res, next) => {
  console.log("Error:", err);
  res.status(500).send("Error interno del servidor");
});

// Conexión a BD
const conectar = async () => {
  try {
    await mongoose.connect(config.MONGO_URL, {
      dbName: config.DB_NAME,
    });

    console.log(`Conexion a DB establecida`);

    servidor.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(`Error al conectarse con el servidor de BD: ${err}`);
  }
};

conectar();
