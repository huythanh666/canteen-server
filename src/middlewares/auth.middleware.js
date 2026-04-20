import { verifyAccessToken } from "../utils/jwt.util.js";
export const checkAccessToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: 'Bạn chưa đăng nhập!' });
  }
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Phiên đăng nhập hết hạn' });
  }
};