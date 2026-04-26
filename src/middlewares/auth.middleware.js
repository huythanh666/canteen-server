import {
  BUSSINESS_PERMISSION,
  REQUIRED_ROLE_ADMIN,
} from "../constant/auth.constant.js";
import { verifyAccessToken } from "../utils/jwt.util.js";
import { sendError } from "../utils/response.util.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return sendError(res, "Bạn chưa đăng nhập!", 401);
  }
  try {
    const decoded = verifyAccessToken(token);
    if (decoded.status == "INACTIVE")
      return sendError(res, "Tài khoản của bạn đã bị khoá", 400);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, "Phiên đăng nhập hết hạn hoặc không hợp lệ", 401);
  }
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = verifyAccessToken(token);
    if (decoded.status == "INACTIVE")
      return sendError(res, "Tài khoản của bạn đã bị khoá", 400);
    req.user = decoded;
    next();
  } catch (error) {
    req.user = null;
    return next();
  }
};

export const checkRolePermission = (req, res, next) => {
  if (!req.user) {
    return sendError(res, "Hệ thống không xác định được người dùng", 500);
  }
  const isAllowed = REQUIRED_ROLE_ADMIN.includes(req.user.role);
  if (!isAllowed) {
    return sendError(
      res,
      "Bạn không đủ quyền hạn để thực hiện hành động này!",
      403,
    );
  }
  next();
};

export const checkBussinessPermission = (req, res, next) => {
  if (!req.user) {
    return sendError(res, "Hệ thống không xác định được người dùng", 500);
  }
  const isAllowed = BUSSINESS_PERMISSION.includes(req.user.role);
  if (!isAllowed) {
    return sendError(
      res,
      "Bạn không đủ quyền hạn để thực hiện hành động này!",
      403,
    );
  }
  next();
};

export const superAdminPermission = (req, res, next) => {
  if (!req.user) {
    return sendError(res, "Hệ thống không xác định được người dùng", 500);
  }
  if (req.user.role !== "SUPER_ADMIN") {
    return sendError(
      res,
      "Bạn không đủ quyền hạn để thực hiện hành động này!",
      403,
    );
  }
  next();
};
