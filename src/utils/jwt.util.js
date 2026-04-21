import jwt from "jsonwebtoken";
import { AUTH_CONFIG } from "../configs/auth.config.js";
const generateAccessToken = (payload) => {
  return jwt.sign(payload, AUTH_CONFIG.ACCESS_SECRET, {
    expiresIn: AUTH_CONFIG.ACCESS_EXPIRE,
  });
};
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, AUTH_CONFIG.REFRESH_SECRET, {
    expiresIn: AUTH_CONFIG.REFRESH_EXPIRE,
  });
};
const verifyAccessToken = (token) => {
  return jwt.verify(token, AUTH_CONFIG.ACCESS_SECRET);
};
const verifyRefreshToken = (token) => {
  return jwt.verify(token, AUTH_CONFIG.REFRESH_SECRET);
};
const generateTokenJWT = (data) => {
  const accessToken = generateAccessToken(data);
  const refreshToken = generateRefreshToken(data);
  return { accessToken, refreshToken };
};
export {
  generateTokenJWT,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
