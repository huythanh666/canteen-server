import { sendError } from "../utils/response.util.js";
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  if (err.code === "P2002") {
    statusCode = 400;
    message = "Dữ liệu (email/username) đã tồn tại.";
  }
  if (req.path.includes("/auth")) {
    res.clearCookie("refreshToken");
  }
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Token không hợp lệ.";
  }
  return sendError(res, message, statusCode, err);
};
export default errorMiddleware;
