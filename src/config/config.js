import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  DB_NAME: process.env.DB_NAME || "ecommerce",
  SECRET: process.env.SECRET || "ecomCoder26",
  MONGO_URL: process.env.MONGO_URL,
};
