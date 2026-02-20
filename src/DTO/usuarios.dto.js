export class UsuarioDTO {
  constructor(usuario) {
    this._id = usuario._id;
    this.first_name = usuario.first_name;
    this.last_name = usuario.last_name;
    this.full_name = `${usuario.first_name} ${usuario.last_name}`;
    this.email = usuario.email;
    this.age = usuario.age;
    this.role = usuario.role;
    this.cart = usuario.cart?._id || usuario.cart;
  }
}
