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
        console.log(decoded)
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
        req.user = decoded;
        next();
    } catch (error) {
        return sendError(res, "Token không hợp lệ", 401);
    }
};