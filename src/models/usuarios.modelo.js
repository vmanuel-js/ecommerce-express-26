import mongoose from "mongoose";

export const usuariosModelo = new mongoose.model(
  "users",
  new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    age: Number,
    password: {
      type: String,
      required: true,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    role: {
      type: String,
      default: "user",
    },
  }),
);
