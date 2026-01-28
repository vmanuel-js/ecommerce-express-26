const divMensaje = document.getElementById("mensaje");
const inputFirstName = document.getElementById("first_name");
const inputLastName = document.getElementById("last_name");
const inputEmail = document.getElementById("email");
const inputEdad = document.getElementById("age");
const inputPassword = document.getElementById("password");

const btnSubmit = document.getElementById("btnSubmit");

btnSubmit.addEventListener("click", async (e) => {
  e.preventDefault();

  let first_name = inputFirstName.value;
  let last_name = inputLastName.value;
  let email = inputEmail.value;
  let age = inputEdad.value;
  let password = inputPassword.value;

  if (!first_name || !last_name || !email || !age || !password) {
    divMensaje.textContent = "Ingrese todas sus credenciales";
    setTimeout(() => {
      divMensaje.textContent = "";
    }, 3000);
    return;
  }

  let body = { first_name, last_name, email, age, password };

  let response = await fetch("/api/sessions/register", {
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

  window.location.href = `/login?mensaje=Registro exitoso para ${first_name}. Ya puedes iniciar sesión`;
});
