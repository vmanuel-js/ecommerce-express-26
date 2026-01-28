const divMensaje = document.getElementById("mensaje");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");

const btnSubmit = document.getElementById("btnSubmit");

btnSubmit.addEventListener("click", async (e) => {
  e.preventDefault();

  let email = inputEmail.value;
  let password = inputPassword.value;

  if (!email || !password) {
    divMensaje.textContent = "Ingrese todas sus credenciales";
    setTimeout(() => {
      divMensaje.textContent = "";
    }, 3000);
    return;
  }

  let body = { email, password };

  let response = await fetch("/api/sessions/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.status >= 400) {
    let { error } = await response.json();
    divMensaje.textContent = `Error en el registro: ${error}`;
    return;
  }

  window.location.href = "/current";
});
