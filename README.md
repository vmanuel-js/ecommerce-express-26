# Ecommerce - Entrega N° 1

Proyecto de ecommerce con sistema de autenticación JWT, CRUD de usuarios, gestión de productos y carritos de compra desarrollado con Node.js, Express y MongoDB.

## 📋 Descripción

Sistema completo de ecommerce que implementa:
- Autenticación y autorización con JWT
- Gestión de usuarios con roles (user/admin)
- CRUD completo de productos
- Sistema de carritos de compra
- Actualización en tiempo real con WebSockets

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- Registro de usuarios con contraseñas encriptadas (bcrypt)
- Login con JWT almacenado en cookies HTTP-only
- Validación de sesión mediante `/api/sessions/current`
- Sistema de roles (user/admin) para autorización
- Cada usuario obtiene automáticamente un carrito al registrarse

### 👥 CRUD de Usuarios
- **GET** `/api/sessions/` - Listar todos los usuarios (solo admin)
- **GET** `/api/sessions/:uid` - Obtener usuario por ID
- **PUT** `/api/sessions/:uid` - Actualizar información de usuario
- **DELETE** `/api/sessions/:uid` - Eliminar usuario

### 🛍️ Gestión de Productos
- CRUD completo de productos
- Paginación (8 productos por página por defecto)
- Filtros por categoría y disponibilidad
- Ordenamiento por precio (ascendente/descendente)
- Actualización en tiempo real con Socket.IO

### 🛒 Sistema de Carritos
- Creación automática al registrar usuario
- Agregar/eliminar productos
- Actualizar cantidades
- Vaciar carrito completo
- Relación directa User ↔ Cart

## 🚀 Instalación

### Requisitos Previos
- Node.js (v14 o superior)
- MongoDB Atlas o MongoDB local
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
```bash
cd entrega1-express-coder
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Edita el archivo `config/config.js`:

```javascript
export const config = {
  PORT: 3000,
  DB_NAME: "ecommerce-entrega-jordan", // Tu nombre de BD
  SECRET: "ecomCoder26", // Secreto para JWT
  MONGO_URL: "TU_URL_DE_MONGODB", // URL de conexión
};
```

4. **Iniciar el servidor**

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

5. **Acceder a la aplicación**
```
http://localhost:3000
```

## 📁 Estructura del Proyecto

```
entrega1-express-coder/
├── config/
│   ├── config.js                 # Configuración general
│   └── config.passport.js        # Estrategias de Passport (JWT, Local)
├── controllers/
│   ├── carts.controllers.js      # Lógica de carritos
│   ├── products.controllers.js   # Lógica de productos
│   ├── viewCarts.controllers.js  # Renderizado de vistas de carritos
│   └── viewProducts.controllers.js # Renderizado de vistas de productos
├── dao/
│   ├── models/
│   │   ├── cart.model.js         # Modelo de Carrito
│   │   ├── product.model.js      # Modelo de Producto
│   │   └── usuarios.modelo.js    # Modelo de Usuario
│   └── UsuariosManager.Mongo.js  # Manager de usuarios
├── managers/
│   └── ProductosManager.js       # Manager de productos
├── public/
│   ├── css/
│   │   └── styles.css            # Estilos de la aplicación
│   └── js/
│       ├── login.js              # Lógica de login
│       ├── registro.js           # Lógica de registro
│       └── realtime.js           # WebSocket para productos
├── routes/
│   ├── carts.route.js            # Rutas API de carritos
│   ├── carts.view.route.js       # Rutas de vistas de carritos
│   ├── products.route.js         # Rutas API de productos
│   ├── products.view.route.js    # Rutas de vistas de productos
│   ├── realtime.route.js         # Ruta de productos en tiempo real
│   ├── usuarios.router.js        # Rutas de usuarios y sesiones
│   └── vistas.router.js          # Rutas de vistas principales
├── views/
│   ├── layouts/
│   │   └── main.handlebars       # Layout principal
│   ├── partials/
│   │   └── header.handlebars     # Navegación
│   ├── cart.handlebars           # Vista de carrito
│   ├── cartsIndex.handlebars     # Búsqueda de carrito
│   ├── current.handlebars        # Perfil de usuario
│   ├── home.handlebars           # Página de inicio
│   ├── login.handlebars          # Formulario de login
│   ├── products.handlebars       # Lista de productos
│   ├── realtimeProducts.handlebars # Productos en tiempo real
│   └── registro.handlebars       # Formulario de registro
├── index.js                      # Punto de entrada de la aplicación
├── utils.js                      # Utilidades (bcrypt)
└── package.json                  # Dependencias del proyecto
```

## 🔌 API Endpoints

### Autenticación y Sesiones

#### Registrar usuario
```http
POST /api/sessions/register
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 25,
  "password": "123456"
}
```

#### Iniciar sesión
```http
POST /api/sessions/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "123456"
}
```

#### Obtener usuario actual
```http
GET /api/sessions/current
Cookie: cookieToken=JWT_TOKEN
```

#### Cerrar sesión
```http
POST /api/sessions/logout
```

### CRUD de Usuarios

#### Listar usuarios (Admin)
```http
GET /api/sessions/
Cookie: cookieToken=JWT_TOKEN
```

#### Obtener usuario por ID
```http
GET /api/sessions/:uid
Cookie: cookieToken=JWT_TOKEN
```

#### Actualizar usuario
```http
PUT /api/sessions/:uid
Cookie: cookieToken=JWT_TOKEN
Content-Type: application/json

{
  "first_name": "Juan Carlos",
  "age": 26
}
```

#### Eliminar usuario
```http
DELETE /api/sessions/:uid
Cookie: cookieToken=JWT_TOKEN
```

### Productos

#### Listar productos (con paginación)
```http
GET /api/products?limit=8&page=1&sort=asc&query=Laptops
```

Parámetros opcionales:
- `limit`: Productos por página (default: 8)
- `page`: Número de página (default: 1)
- `sort`: Ordenar por precio (`asc` o `desc`)
- `query`: Filtrar por categoría o disponibilidad (`available`, `unavailable`)

#### Obtener producto por ID
```http
GET /api/products/:pid
```

#### Crear producto
```http
POST /api/products
Content-Type: application/json

{
  "title": "Laptop Gamer",
  "description": "RTX 3060, 16GB RAM",
  "code": "L001",
  "price": 5200,
  "stock": 10,
  "category": "Laptops"
}
```

#### Actualizar producto
```http
PUT /api/products/:pid
Content-Type: application/json

{
  "price": 4999,
  "stock": 8
}
```

#### Eliminar producto
```http
DELETE /api/products/:pid
```

### Carritos

#### Crear carrito
```http
POST /api/carts
```

#### Obtener carrito por ID
```http
GET /api/carts/:cid
```

#### Agregar producto al carrito
```http
POST /api/carts/:cid/product/:pid
```

#### Actualizar cantidad de producto
```http
PUT /api/carts/:cid/product/:pid
Content-Type: application/json

{
  "quantity": 3
}
```

#### Eliminar producto del carrito
```http
DELETE /api/carts/:cid/product/:pid
```

#### Actualizar todo el carrito
```http
PUT /api/carts/:cid
Content-Type: application/json

{
  "productos": [
    {
      "product": "PRODUCT_ID",
      "quantity": 2
    }
  ]
}
```

#### Vaciar carrito
```http
DELETE /api/carts/:cid
```

## 🌐 Rutas de Vistas

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio |
| `/register` | Formulario de registro |
| `/login` | Formulario de login |
| `/current` | Perfil de usuario (requiere autenticación) |
| `/products` | Lista de productos con paginación |
| `/carts` | Búsqueda de carrito |
| `/carts/:cid` | Vista detallada del carrito |
| `/realtimeproducts` | Productos en tiempo real (WebSocket) |

## 📊 Modelos de Datos

### Usuario (User)
```javascript
{
  first_name: String,
  last_name: String,
  email: String (unique, required),
  age: Number,
  password: String (hashed, required),
  cart: ObjectId (ref: Cart),
  role: String (default: "user")
}
```

### Producto (Product)
```javascript
{
  title: String (required),
  description: String (required),
  code: String (required),
  price: Number (required),
  status: Boolean (required),
  stock: Number (required),
  category: String (required),
  thumbnails: [String]
}
```

### Carrito (Cart)
```javascript
{
  productos: [
    {
      product: ObjectId (ref: Product),
      quantity: Number (default: 1)
    }
  ]
}
```

## 🔒 Sistema de Autorización

### Roles

#### Usuario Normal (`role: "user"`)
- Ver su propia información
- Actualizar su perfil
- Eliminar su cuenta
- Acceder a su carrito

#### Administrador (`role: "admin"`)
- Ver todos los usuarios
- Actualizar cualquier usuario
- Eliminar cualquier usuario
- Cambiar roles de usuarios

### Crear un Administrador

Para convertir un usuario en administrador:

1. Registra un usuario normalmente
2. Accede a MongoDB Atlas o Compass
3. Busca el usuario por email en la colección `users`
4. Cambia el campo `role` de `"user"` a `"admin"`

O usando MongoDB Shell:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | v14+ | Runtime de JavaScript |
| Express | ^5.1.0 | Framework web |
| MongoDB | - | Base de datos NoSQL |
| Mongoose | ^9.0.0 | ODM para MongoDB |
| Passport | ^0.7.0 | Autenticación |
| Passport-JWT | ^4.0.1 | Estrategia JWT |
| Passport-Local | ^1.0.0 | Estrategia Local |
| bcrypt | ^5.1.1 | Hash de contraseñas |
| jsonwebtoken | ^9.0.2 | Generación de JWT |
| Socket.IO | ^4.8.1 | WebSockets |
| Express-Handlebars | ^8.0.3 | Motor de plantillas |
| mongoose-paginate-v2 | ^1.9.1 | Paginación |
| cookie-parser | ^1.4.6 | Manejo de cookies |

## 🎯 Funcionalidades Destacadas

### ✅ Registro Automático de Carrito
Al registrarse, cada usuario obtiene automáticamente un carrito vacío asociado.

### ✅ Seguridad
- Contraseñas hasheadas con bcrypt (10 rounds)
- JWT almacenado en cookies HTTP-only
- Tokens con expiración de 1 hora
- Validación de permisos por rol

### ✅ Paginación Inteligente
Sistema de paginación con:
- Límite configurable de productos por página
- Navegación entre páginas
- Enlaces previos/siguientes
- Información de página actual y total

### ✅ Tiempo Real
Actualización instantánea de productos usando WebSocket:
- Los cambios se reflejan en todos los clientes conectados
- Sin necesidad de recargar la página

## 📝 Ejemplos de Uso

### Flujo Completo de Usuario

1. **Registro**
   - Usuario completa formulario en `/register`
   - Sistema crea usuario + carrito automático
   - Redirección a `/login`

2. **Login**
   - Usuario ingresa credenciales en `/login`
   - Sistema genera JWT y lo almacena en cookie
   - Redirección a `/current` (perfil)

3. **Ver Productos**
   - Usuario navega a `/products`
   - Ve catálogo con paginación
   - Puede filtrar por categoría o precio

4. **Gestionar Carrito**
   - Desde `/current`, accede a su carrito
   - Agrega productos (via API)
   - Actualiza cantidades
   - Finaliza compra

### Ejemplo de Filtrado de Productos

```
# Ver solo laptops
GET /products?query=Laptops

# Ver productos disponibles
GET /products?query=available

# Ordenar por precio ascendente
GET /products?sort=asc

# Combinar filtros
GET /products?query=Accesorios&sort=desc&limit=5
```

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
**Síntoma**: `Error al conectarse con el servidor de BD`

**Solución**:
- Verifica tu URL de MongoDB en `config/config.js`
- Asegúrate de tener conexión a internet
- Revisa que tu IP esté en la whitelist de MongoDB Atlas

### Error "Usuario no autorizado"
**Síntoma**: `401 Unauthorized` al acceder a rutas protegidas

**Solución**:
- Verifica que hayas hecho login
- Revisa que la cookie `cookieToken` esté presente
- El token expira en 1 hora, vuelve a hacer login

### Productos no aparecen
**Síntoma**: Lista de productos vacía

**Solución**:
- Crea productos desde `/realtimeproducts`
- O usa Postman para crear productos via API
- Verifica la conexión a MongoDB

### Socket.IO no funciona
**Síntoma**: `io is not defined` en consola

**Solución**:
- Verifica que `/socket.io/socket.io.js` se cargue antes de `realtime.js`
- Reinicia el servidor
- Limpia caché del navegador (Ctrl+Shift+R)

## 👨‍💻 Autor

- Victor Manuel Jordan Solis