const socket = io();

socket.on("listaProductos", (productos) => {
  const contenedor = document.getElementById("lista");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  productos.forEach((p) => {
    contenedor.innerHTML += `
      <li>
        <strong>${p.title}</strong> - $${p.price}
        ${p.description ? `<br><small>${p.description}</small>` : ""}
        <br>Stock: ${p.stock} | Categoría: ${p.category}
      </li>
    `;
  });
});

document.getElementById("formProducto").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const price = parseFloat(document.getElementById("price").value);
  const stock = parseInt(document.getElementById("stock").value);
  const category = document.getElementById("category").value;

  socket.emit("nuevoProducto", {
    title,
    description,
    code,
    price,
    stock,
    category,
    status: true,
  });

  e.target.reset();
});