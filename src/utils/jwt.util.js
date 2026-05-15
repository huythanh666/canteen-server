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
/*
{
    id: '510eda20-3fa0-11f1-b288-6af6505f6800',
    inventory_id: 'dff37e90-3f9d-11f1-b288-6af6505f6800',
    order_id: null,
    staff_id: 'c2b2d99c-8aea-4c00-8a70-accbde8a3a35',
    type: 'IMPORT',
    quantity: 12,
    created_at: 2026-04-01T08:10:00.000Z,
    description: 'Nhập kho hàng',
    inventory: {
      inventory_name: 'Sữa đặc Ngôi Sao',
      unit: 'hộp',
      canteen: [Object]
    },
    staff: { name: 'Huy Thành' },
    order: null
  },
  {
    id: '510ed9c7-3fa0-11f1-b288-6af6505f6800',
    inventory_id: 'dff37e44-3f9d-11f1-b288-6af6505f6800',
    order_id: null,
    staff_id: 'c2b2d99c-8aea-4c00-8a70-accbde8a3a35',
    type: 'IMPORT',
    quantity: 150,
    created_at: 2026-04-01T08:09:00.000Z,
    description: 'Nhập kho hàng',
    inventory: { inventory_name: 'Trứng gà ta', unit: 'quả', canteen: [Object] },
    staff: { name: 'Huy Thành' },
    order: null
  },
  {
    id: '510ed96b-3fa0-11f1-b288-6af6505f6800',
    inventory_id: 'dff376c3-3f9d-11f1-b288-6af6505f6800',
    order_id: null,
    staff_id: 'c2b2d99c-8aea-4c00-8a70-accbde8a3a35',
    type: 'IMPORT',
    quantity: 30,
    created_at: 2026-04-01T08:08:00.000Z,
    description: 'Nhập kho hàng',
    inventory: {
      inventory_name: 'Dầu ăn Tường An',
      unit: 'lít',
      canteen: [Object]
    },
    staff: { name: 'Huy Thành' },
    order: null
  },
  {
    id: '510ed916-3fa0-11f1-b288-6af6505f6800',
    inventory_id: '854d465d-3f52-11f1-84d7-0221cc8ef9b2',
    order_id: null,
    staff_id: 'c2b2d99c-8aea-4c00-8a70-accbde8a3a35',
    type: 'IMPORT',
    quantity: 10,
    created_at: 2026-04-01T08:07:00.000Z,
    description: 'Nhập kho hàng',
    inventory: { inventory_name: 'Chanh tươi', unit: 'kg', canteen: [Object] },
    staff: { name: 'Huy Thành' },
    order: null
  },
  {
    id: '510ed8c0-3fa0-11f1-b288-6af6505f6800',
    inventory_id: '85474e0f-3f52-11f1-84d7-0221cc8ef9b2',
    order_id: null,
    staff_id: 'c2b2d99c-8aea-4c00-8a70-accbde8a3a35',
    type: 'IMPORT',
    quantity: 10,
    created_at: 2026-04-01T08:06:00.000Z,
    description: 'Nhập kho hàng',
    inventory: { inventory_name: 'Trà lá khô', unit: 'kg', canteen: [Object] },
    staff: { name: 'Huy Thành' },
    order: null
  },
  {
    id: '510ed864-3fa0-11f1-b288-6af6505f6800',
    inventory_id: '8542b15e-3f52-11f1-84d7-0221cc8ef9b2',
    order_id: null,
    staff_id: 'c2b2d99c-8aea-4c00-8a70-accbde8a3a35',
    type: 'IMPORT',
    quantity: 20,
    created_at: 2026-04-01T08:05:00.000Z,
    description: 'Nhập kho hàng',
    inventory: { inventory_name: 'Đường cát', unit: 'kg', canteen: [Object] },
    staff: { name: 'Huy Thành' },
    order: null
  },
  {
    id: '510ed7f7-3fa0-11f1-b288-6af6505f6800',
    inventory_id: '853dd202-3f52-11f1-84d7-0221cc8ef9b2',
    order_id: null,
    staff_id: 'c2b2d99c-8aea-4c00-8a70-accbde8a3a35',
    type: 'IMPORT',
    quantity: 20,
    created_at: 2026-04-01T08:04:00.000Z,
    description: 'Nhập kho hàng',
    inventory: { inventory_name: 'Cà phê hạt', unit: 'kg', canteen: [Object] },
    staff: { name: 'Huy Thành' },
    order: null
  },
  {
    id: '510ed791-3fa0-11f1-b288-6af6505f6800',
    inventory_id: '8539802f-3f52-11f1-84d7-0221cc8ef9b2',
    order_id: null,
    staff_id: 'c2b2d99c-8aea-4c00-8a70-accbde8a3a35',
    type: 'IMPORT',
    quantity: 10,
    created_at: 2026-04-01T08:03:00.000Z,
    description: 'Nhập kho hàng',
    inventory: { inventory_name: 'Bột mì', unit: 'kg', canteen: [Object] },
    staff: { name: 'Huy Thành' },
    order: null
  },
  {
    id: '510ed69e-3fa0-11f1-b288-6af6505f6800',
    inventory_id: '85353dcb-3f52-11f1-84d7-0221cc8ef9b2',
    order_id: null,
    staff_id: 'c2b2d99c-8aea-4c00-8a70-accbde8a3a35',
    type: 'IMPORT',
    quantity: 10,
    created_at: 2026-04-01T08:02:00.000Z,
    description: 'Nhập kho hàng',
    inventory: { inventory_name: 'Xà lách', unit: 'kg', canteen: [Object] },
    staff: { name: 'Huy Thành' },
    order: null
  },
  {
    id: '510ed630-3fa0-11f1-b288-6af6505f6800',
    inventory_id: '8530bc08-3f52-11f1-84d7-0221cc8ef9b2',
    order_id: null,
    staff_id: 'c2b2d99c-8aea-4c00-8a70-accbde8a3a35',
    type: 'IMPORT',
    quantity: 50,
    created_at: 2026-04-01T08:01:00.000Z,
    description: 'Nhập kho hàng',
    inventory: { inventory_name: 'Thịt Gà tươi', unit: 'kg', canteen: [Object] },
    staff: { name: 'Huy Thành' },
    order: null
  },
  {
    id: '510ed4bc-3fa0-11f1-b288-6af6505f6800',
    inventory_id: '8529682f-3f52-11f1-84d7-0221cc8ef9b2',
    order_id: null,
    staff_id: 'c2b2d99c-8aea-4c00-8a70-accbde8a3a35',
    type: 'IMPORT',
    quantity: 200,
    created_at: 2026-04-01T08:00:00.000Z,
    description: 'Nhập kho hàng',
    inventory: { inventory_name: 'Gạo ST25', unit: 'kg', canteen: [Object] },
    staff: { name: 'Huy Thành' },
    order: null
  }
]

*/
