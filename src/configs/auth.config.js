import dotenv from "dotenv";
dotenv.config();

export const AUTH_CONFIG = {
  ACCESS_SECRET: process.env.ACCESS_TOKEN_SECRECT,
  REFRESH_SECRET: process.env.REFRESH_TOKEN_SECRECT,
  ACCESS_EXPIRE: "15m",
  REFRESH_EXPIRE: "7d",
};
