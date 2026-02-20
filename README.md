# Ecommerce Backend - Entrega Final

Sistema completo de ecommerce con arquitectura profesional implementando patrones de diseño (DAO, Repository, Service), autenticación JWT, roles de usuario, y sistema de compras con tickets.

## 📋 Descripción

Proyecto backend de ecommerce que implementa:

- **Arquitectura en capas**: DAO → Repository → Service → Controller
- **Autenticación y autorización** con JWT y roles (user/admin)
- **Sistema de compras** con validación de stock y generación de tickets
- **DTOs** para protección de datos sensibles
- **Middleware de autorización** para control de acceso por roles
- **CRUD completo** de usuarios, productos y carritos
- **WebSockets** para actualización en tiempo real

## ✨ Características Principales

### 🏗️ Arquitectura Profesional

Controller → Service → Repository → DAO → MongoDB
↓ ↓ ↓ ↓
Req/Res Lógica de Acceso a CRUD
Negocio Datos Básico

**Patrones Implementados:**

- **DAO (Data Access Object)**: Capa de persistencia con CRUD básico
- **Repository**: Abstracción de acceso a datos
- **Service**: Lógica de negocio y validaciones
- **DTO (Data Transfer Object)**: Filtrado de información sensible

### 🔐 Sistema de Autenticación y Autorización

#### Autenticación

- Registro con contraseñas encriptadas (bcrypt)
- Login con JWT en cookies HTTP-only (1 hora de expiración)
- Estrategia JWT con Passport para validación de tokens
- Carrito asignado automáticamente al registrarse

#### Autorización por Roles

- **User (role: "user")**:
  - Ver y gestionar su propio perfil
  - Agregar productos a su carrito
  - Realizar compras
- **Admin (role: "admin")**:
  - Todas las acciones de User
  - Crear, actualizar y eliminar productos
  - Ver todos los usuarios del sistema
  - Gestionar roles

### 🎫 Sistema de Tickets y Compras

**Proceso de compra:**

1. Usuario agrega productos al carrito
2. Al finalizar compra, el sistema:
   - Valida que el carrito pertenezca al usuario
   - Verifica stock disponible de cada producto
   - Descuenta stock de productos comprados
   - Genera ticket con código único (UUID)
   - Productos sin stock quedan en el carrito

**Modelo de Ticket:**

```javascript
{
  code: String (único),
  purchase_datetime: Date,
  amount: Number (total),
  purchaser: String (email),
  products: [{
    product: ObjectId,
    quantity: Number,
    price: Number
  }]
}
```

### 🛡️ DTOs (Data Transfer Objects)

Protección de información sensible:

**Usuario DTO** (`/api/sessions/current`):

```javascript
{
  (_id, first_name, last_name, full_name, email, age, role, cart);
  // NO incluye: password, __v, timestamps
}
```

## 🚀 Instalación

### Requisitos Previos

- Node.js (v14 o superior)
- MongoDB Atlas o MongoDB local
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone <tu-repositorio>
cd entrega1-express-coder
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz:

```env
PORT=3000
DB_NAME=ecommerce-entrega
SECRET=tu_secreto_jwt
MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net/
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
src/
├── DAO/                          # Capa de persistencia (CRUD básico)
│   ├── carts.dao.js
│   ├── products.dao.js
│   ├── tickets.dao.js
│   └── usuarios.dao.js
│
├── repositories/                 # Capa de acceso a datos
│   ├── carts.repository.js
│   ├── products.repository.js
│   ├── tickets.repository.js
│   └── usuarios.repository.js
│
├── services/                     # Lógica de negocio
│   ├── carts.service.js
│   ├── products.service.js
│   ├── tickets.service.js
│   └── usuarios.service.js
│
├── controllers/                  # Manejo de req/res
│   ├── carts.controllers.js
│   ├── products.controllers.js
│   ├── tickets.controllers.js
│   ├── viewCarts.controllers.js
│   └── viewProducts.controllers.js
│
├── dto/                          # Data Transfer Objects
│   └── usuario.dto.js
│
├── middlewares/                  # Middleware de autorización
│   └── auth.middleware.js
│
├── models/                       # Esquemas de Mongoose
│   ├── cart.model.js
│   ├── product.model.js
│   ├── ticket.model.js
│   └── usuarios.modelo.js
│
├── routes/                       # Definición de rutas
│   ├── carts.route.js
│   ├── products.route.js
│   ├── tickets.route.js
│   ├── usuarios.router.js
│   └── vistas.router.js
│
├── config/                       # Configuración
│   ├── config.js
│   └── config.passport.js
│
├── views/                        # Plantillas Handlebars
│   ├── layouts/
│   ├── partials/
│   └── ...
│
├── public/                       # Archivos estáticos
│   ├── css/
│   └── js/
│
├── index.js                      # Punto de entrada
├── utils.js                      # Utilidades (bcrypt)
├── .env                          # Variables de entorno
└── package.json                  # Dependencias
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

**Respuesta:**

```json
{
  "message": "Registro exitoso",
  "nuevoUsuario": {
    "_id": "...",
    "first_name": "Juan",
    "last_name": "Pérez",
    "full_name": "Juan Pérez",
    "email": "juan@example.com",
    "age": 25,
    "role": "user",
    "cart": "cart_id_123"
  }
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

**Respuesta:**

```json
{
  "message": "Login exitoso",
  "usuarioLogueado": { ... },
  "cartId": "cart_id_123"
}
```

_Nota: JWT se almacena en cookie HTTP-only_

#### Obtener usuario actual (DTO)

```http
GET /api/sessions/current
Cookie: cookieToken=JWT_TOKEN
```

**Respuesta:**

```json
{
  "payload": {
    "_id": "...",
    "first_name": "Juan",
    "last_name": "Pérez",
    "full_name": "Juan Pérez",
    "email": "juan@example.com",
    "age": 25,
    "role": "user",
    "cart": "cart_id_123"
  }
}
```

#### Cerrar sesión

```http
POST /api/sessions/logout
```

### Productos

#### Listar productos (público)

```http
GET /api/products?limit=8&page=1&sort=asc&query=Laptops
```

**Parámetros opcionales:**

- `limit`: Productos por página (default: 8)
- `page`: Número de página (default: 1)
- `sort`: Ordenar por precio (`asc` o `desc`)
- `query`: Filtrar por categoría o disponibilidad

**Respuesta:**

```json
{
  "status": "success",
  "payload": [
    /* productos */
  ],
  "totalPages": 10,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "http://localhost:3000/api/products?page=2&limit=8"
}
```

#### Obtener producto por ID (público)

```http
GET /api/products/:pid
```

#### Crear producto (solo admin)

```http
POST /api/products
Cookie: cookieToken=JWT_TOKEN_ADMIN
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

#### Actualizar producto (solo admin)

```http
PUT /api/products/:pid
Cookie: cookieToken=JWT_TOKEN_ADMIN
Content-Type: application/json

{
  "price": 4999,
  "stock": 8
}
```

#### Eliminar producto (solo admin)

```http
DELETE /api/products/:pid
Cookie: cookieToken=JWT_TOKEN_ADMIN
```

### Carritos

#### Crear carrito (público)

```http
POST /api/carts
```

#### Obtener carrito por ID (público)

```http
GET /api/carts/:cid
```

**Respuesta:**

```json
{
  "status": "success",
  "payload": {
    "_id": "cart_id",
    "productos": [
      {
        "product": {
          "_id": "prod_id",
          "title": "Laptop HP",
          "price": 1000,
          "stock": 5
        },
        "quantity": 2
      }
    ]
  }
}
```

#### Agregar producto al carrito (solo user)

```http
POST /api/carts/:cid/product/:pid
Cookie: cookieToken=JWT_TOKEN_USER
Content-Type: application/json

{
  "quantity": 2
}
```

#### Actualizar cantidad de producto (solo user)

```http
PUT /api/carts/:cid/product/:pid
Cookie: cookieToken=JWT_TOKEN_USER
Content-Type: application/json

{
  "quantity": 5
}
```

#### Eliminar producto del carrito (solo user)

```http
DELETE /api/carts/:cid/product/:pid
Cookie: cookieToken=JWT_TOKEN_USER
```

#### Vaciar carrito (solo user)

```http
DELETE /api/carts/:cid
Cookie: cookieToken=JWT_TOKEN_USER
```

### Compras y Tickets

#### Finalizar compra (solo user)

```http
POST /api/carts/:cid/purchase
Cookie: cookieToken=JWT_TOKEN_USER
```

**Respuesta exitosa:**

```json
{
  "status": "success",
  "message": "Compra realizada exitosamente",
  "ticket": {
    "_id": "...",
    "code": "abc-123-def-456",
    "purchase_datetime": "2024-02-19T10:30:00Z",
    "amount": 2150,
    "purchaser": "juan@example.com",
    "products": [
      {
        "product": "prod_id_1",
        "quantity": 2,
        "price": 1000
      },
      {
        "product": "prod_id_2",
        "quantity": 1,
        "price": 150
      }
    ]
  }
}
```

**Respuesta con productos sin stock:**

```json
{
  "status": "success",
  "message": "Compra realizada parcialmente. Algunos productos no tenían stock suficiente",
  "ticket": {
    /* ticket con productos comprados */
  },
  "productosSinStock": [
    {
      "product": "prod_id_3",
      "quantity": 5
    }
  ]
}
```

#### Ver todos los tickets (solo admin)

```http
GET /api/tickets
Cookie: cookieToken=JWT_TOKEN_ADMIN
```

#### Ver ticket por ID

```http
GET /api/tickets/:tid
Cookie: cookieToken=JWT_TOKEN
```

## 📊 Modelos de Datos

### Usuario (User)

```javascript
{
  first_name: String,
  last_name: String,
  email: String (unique, required),
  age: Number,
  password: String (hashed, required),
  cart: ObjectId (ref: "Cart"),
  role: String (default: "user", values: ["user", "admin"])
}
```

### Producto (Product)

```javascript
{
  title: String (required),
  description: String (required),
  code: String (required, unique),
  price: Number (required),
  status: Boolean (required, default: true),
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
      product: ObjectId (ref: "Product"),
      quantity: Number (default: 1)
    }
  ]
}
```

### Ticket

```javascript
{
  code: String (unique, required),
  purchase_datetime: Date (required, default: Date.now),
  amount: Number (required),
  purchaser: String (required, email del comprador),
  products: [
    {
      product: ObjectId (ref: "Product"),
      quantity: Number (required),
      price: Number (required)
    }
  ]
}
```

## 🌐 Rutas de Vistas (Handlebars)

| Ruta                | Descripción                          | Auth |
| ------------------- | ------------------------------------ | ---- |
| `/`                 | Página de inicio                     | No   |
| `/register`         | Formulario de registro               | No   |
| `/login`            | Formulario de login                  | No   |
| `/current`          | Perfil de usuario                    | Sí   |
| `/products`         | Lista de productos con paginación    | No   |
| `/carts`            | Búsqueda de carrito                  | No   |
| `/carts/:cid`       | Vista detallada del carrito          | No   |
| `/realtimeproducts` | Productos en tiempo real (WebSocket) | No   |

## 🔒 Sistema de Autorización por Roles

### Permisos por Rol

#### Usuario Normal (`role: "user"`)

✅ **Puede:**

- Registrarse y hacer login
- Ver su perfil (`/api/sessions/current`)
- Ver productos (`GET /api/products`)
- Agregar productos a su carrito
- Actualizar su carrito
- Realizar compras
- Ver sus propios tickets

❌ **No puede:**

- Crear, actualizar o eliminar productos
- Ver información de otros usuarios
- Acceder a carritos de otros usuarios

#### Administrador (`role: "admin"`)

✅ **Puede:**

- Todo lo que puede hacer un User
- Crear productos (`POST /api/products`)
- Actualizar productos (`PUT /api/products/:pid`)
- Eliminar productos (`DELETE /api/products/:pid`)
- Ver todos los usuarios (`GET /api/sessions`)
- Ver todos los tickets (`GET /api/tickets`)
- Cambiar roles de usuarios

### Crear un Administrador

**Opción 1: Manualmente en MongoDB**

1. Registra un usuario normalmente
2. Accede a MongoDB Compass o Atlas
3. Busca el usuario en la colección `users`
4. Cambia `role: "user"` a `role: "admin"`

**Opción 2: MongoDB Shell**

```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } });
```

**Opción 3: Crear endpoint temporal** (eliminar después)

```javascript
// En usuarios.router.js - SOLO PARA DESARROLLO
router.post("/create-admin", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  // ... crear usuario con role: "admin"
});
```

## 🛠️ Tecnologías Utilizadas

| Tecnología           | Versión   | Uso                              |
| -------------------- | --------- | -------------------------------- |
| **Backend**          |
| Node.js              | v14+      | Runtime de JavaScript            |
| Express              | ^5.1.0    | Framework web                    |
| **Base de Datos**    |
| MongoDB              | -         | Base de datos NoSQL              |
| Mongoose             | ^9.0.0    | ODM para MongoDB                 |
| mongoose-paginate-v2 | ^1.9.1    | Paginación de resultados         |
| **Autenticación**    |
| Passport             | ^0.7.0    | Middleware de autenticación      |
| Passport-JWT         | ^4.0.1    | Estrategia JWT                   |
| Passport-Local       | ^1.0.0    | Estrategia Local                 |
| bcrypt               | ^6.0.0    | Hash de contraseñas              |
| jsonwebtoken         | ^9.0.3    | Generación y verificación de JWT |
| cookie-parser        | ^1.4.7    | Manejo de cookies                |
| **Tiempo Real**      |
| Socket.IO            | ^4.8.1    | WebSockets bidireccionales       |
| **Plantillas**       |
| Express-Handlebars   | ^8.0.3    | Motor de plantillas              |
| **Utilidades**       |
| uuid                 | ^13.0.0   | Generación de IDs únicos         |
| dotenv               | ^17.2.3   | Variables de entorno             |
| validator            | ^13.15.23 | Validación de datos              |
| **Desarrollo**       |
| nodemon              | ^3.1.11   | Reinicio automático del servidor |

## 🛠️ Tecnologías Utilizadas

| Tecnología           | Versión | Uso                   |
| -------------------- | ------- | --------------------- |
| Node.js              | v14+    | Runtime de JavaScript |
| Express              | ^5.1.0  | Framework web         |
| MongoDB              | -       | Base de datos NoSQL   |
| Mongoose             | ^9.0.0  | ODM para MongoDB      |
| Passport             | ^0.7.0  | Autenticación         |
| Passport-JWT         | ^4.0.1  | Estrategia JWT        |
| Passport-Local       | ^1.0.0  | Estrategia Local      |
| bcrypt               | ^5.1.1  | Hash de contraseñas   |
| jsonwebtoken         | ^9.0.2  | Generación de JWT     |
| Socket.IO            | ^4.8.1  | WebSockets            |
| Express-Handlebars   | ^8.0.3  | Motor de plantillas   |
| mongoose-paginate-v2 | ^1.9.1  | Paginación            |
| cookie-parser        | ^1.4.6  | Manejo de cookies     |

## 🎯 Flujo Completo de Uso

### 1️⃣ Registro y Login

```bash
# 1. Registrar usuario
POST /api/sessions/register
Body: { first_name, last_name, email, age, password }

# 2. Login (recibe JWT + cartId)
POST /api/sessions/login
Body: { email, password }

# 3. Verificar sesión
GET /api/sessions/current
```

### 2️⃣ Como Usuario (role: "user")

```bash
# 1. Ver productos disponibles
GET /api/products?limit=10

# 2. Agregar productos al carrito
POST /api/carts/:cartId/product/:productId
Body: { quantity: 2 }

# 3. Ver mi carrito
GET /api/carts/:cartId

# 4. Finalizar compra
POST /api/carts/:cartId/purchase
# → Genera ticket, descuenta stock
```

### 3️⃣ Como Administrador (role: "admin")

```bash
# 1. Crear usuario admin (modificar role en BD)

# 2. Login como admin
POST /api/sessions/login
Body: { email: "admin@test.com", password: "..." }

# 3. Crear productos
POST /api/products
Body: { title, description, code, price, stock, category }

# 4. Ver todos los tickets
GET /api/tickets
```

### 📊 Ejemplo Completo

```javascript
// 1. REGISTRO
POST /api/sessions/register
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@test.com",
  "age": 25,
  "password": "123456"
}
// → Respuesta: usuario creado + cart asignado

// 2. LOGIN
POST /api/sessions/login
{
  "email": "juan@test.com",
  "password": "123456"
}
// → Respuesta: JWT en cookie + cartId: "abc123"

// 3. VER PRODUCTOS
GET /api/products
// → Lista de productos con stock

// 4. AGREGAR AL CARRITO
POST /api/carts/abc123/product/prod_001
{
  "quantity": 2
}
// → Producto agregado

// 5. COMPRAR
POST /api/carts/abc123/purchase
// → Ticket generado, stock actualizado
```

## 💡 Funcionalidades Destacadas

### ✅ Arquitectura en Capas

- **Separación clara de responsabilidades**
- **DAO**: Solo interacción con MongoDB
- **Repository**: Abstracción de acceso a datos
- **Service**: Validaciones y lógica de negocio
- **Controller**: Manejo de HTTP

### ✅ Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- JWT almacenado en cookies HTTP-only
- Tokens con expiración automática (1 hora)
- DTOs para ocultar información sensible
- Middleware de autorización por roles

### ✅ Sistema de Compras Robusto

- Validación de stock en tiempo real
- Descuento automático de stock
- Compras parciales (productos sin stock quedan en carrito)
- Generación de tickets con UUID
- Registro completo de transacciones

### ✅ Paginación Inteligente

- Límite configurable por página
- Navegación prev/next
- URLs para cada página
- Información de totalPages y página actual

### ✅ Tiempo Real con WebSockets

- Actualización instantánea de productos
- Sincronización entre clientes
- Sin necesidad de recargar página

### ✅ Manejo de Errores

- Try-catch en todas las capas
- Mensajes de error descriptivos
- Códigos HTTP apropiados
- Validaciones en Services

## 🐛 Solución de Problemas

### Error de conexión a MongoDB

**Síntoma**: `Error al conectarse con el servidor de BD`

**Solución**:

```bash
# 1. Verifica tu .env
MONGO_URL=mongodb+srv://usuario:password@cluster...

# 2. Verifica tu conexión a internet
ping google.com

# 3. Verifica IP whitelist en MongoDB Atlas
# - Ve a Network Access
# - Agrega tu IP actual o 0.0.0.0/0 (desarrollo)
```

### Error "Usuario no autorizado"

**Síntoma**: `401 Unauthorized` o `403 Forbidden`

**Solución**:

```bash
# 1. Verifica que hiciste login
POST /api/sessions/login

# 2. Verifica que la cookie existe
# En Postman: Cookies → cookieToken debe existir

# 3. Si expiró (1 hora), vuelve a hacer login

# 4. Verifica tu rol
GET /api/sessions/current
# → role debe ser "admin" para rutas de admin
```

### Error "Carrito no pertenece al usuario"

**Síntoma**: Al intentar comprar

**Solución**:

```bash
# 1. Verifica que el cartId sea el correcto
GET /api/sessions/current
# → Usa el cart._id de la respuesta

# 2. Asegúrate de estar logueado
# El JWT debe contener el mismo cartId
```

### Productos no aparecen

**Síntoma**: Lista vacía en GET /api/products

**Solución**:

```bash
# 1. Crea productos como admin
POST /api/sessions/login (admin)
POST /api/products

# 2. Verifica en MongoDB
# Colección: products debe tener documentos

# 3. Revisa logs del servidor
# Puede haber errores de conexión
```

### Stock no se descuenta al comprar

**Síntoma**: Después de comprar, el stock sigue igual

**Solución**:

```bash
# 1. Verifica que el ticket se creó
GET /api/tickets

# 2. Revisa logs del servidor
# Puede haber errores en ticketsService

# 3. Verifica que products tenga stock > 0
GET /api/products/:pid
```

### JWT no se guarda en cookie

**Síntoma**: Siempre pide login

**Solución**:

```bash
# En Postman:
# 1. Ve a Settings → General
# 2. Activa "Automatically follow redirects"
# 3. Activa "Send cookies with requests"

# En navegador:
# 1. Abre DevTools → Application → Cookies
# 2. Verifica que "cookieToken" existe
# 3. Si no, limpia cookies y vuelve a hacer login
```

## 🧪 Testing con Postman

### Colección de Pruebas

#### 1. Autenticación

```javascript
// Registrar User
POST http://localhost:3000/api/sessions/register
{
  "first_name": "Test",
  "last_name": "User",
  "email": "test@example.com",
  "age": 25,
  "password": "123456"
}

// Login User
POST http://localhost:3000/api/sessions/login
{
  "email": "test@example.com",
  "password": "123456"
}
// → Guardar cartId de la respuesta

// Ver perfil (DTO)
GET http://localhost:3000/api/sessions/current
// → Verifica que NO tenga password
```

#### 2. Productos (como Admin)

```javascript
// Login Admin (primero cambiar role en BD)
POST http://localhost:3000/api/sessions/login
{
  "email": "admin@example.com",
  "password": "admin123"
}

// Crear Producto
POST http://localhost:3000/api/products
{
  "title": "Laptop Test",
  "description": "Laptop de prueba",
  "code": "TEST001",
  "price": 1000,
  "stock": 10,
  "category": "Electronics"
}
// → Guardar productId

// Listar Productos
GET http://localhost:3000/api/products
```

#### 3. Carrito y Compra (como User)

```javascript
// Login User
POST http://localhost:3000/api/sessions/login
{ "email": "test@example.com", "password": "123456" }

// Agregar producto al carrito
POST http://localhost:3000/api/carts/{cartId}/product/{productId}
{ "quantity": 2 }

// Ver carrito
GET http://localhost:3000/api/carts/{cartId}

// Comprar
POST http://localhost:3000/api/carts/{cartId}/purchase
// → Verifica que se generó el ticket
// → Verifica que el stock se descontó
```

### Variables de Entorno en Postman

```javascript
// Crear estas variables:
{
  "baseUrl": "http://localhost:3000",
  "userToken": "", // Se guarda automáticamente al login
  "adminToken": "",
  "cartId": "",
  "productId": ""
}
```

## 👨‍💻 Autor

- Victor Manuel Jordan Solis
