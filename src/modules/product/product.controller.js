import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess } from "../../utils/response.util.js";
import productService from "./product.service.js";

const productController = {
  getAllProduct: asyncHandler(async (req, res) => {
    const data = await productService.getAll(req.user);
    return sendSuccess(res, "Lấy danh sách thành công", data, 200);
  }),

  getDetailProduct: asyncHandler(async (req, res) => {
    const data = await productService.getById(req.user, req.params.id);
    return sendSuccess(res, "Lấy chi tiết sản phẩm thành công", data, 200);
  }),

  createProduct: asyncHandler(async (req, res) => {
    const data = await productService.create(req.user, req.body);
    return sendSuccess(res, "Tạo sản phẩm thành công", data, 200);
  }),

  updateProduct: asyncHandler(async (req, res) => {
    const data = await productService.updateById(
      req.user,
      req.params.id,
      req.body,
    );
    return sendSuccess(res, "Cập nhập sản phẩm thành công", data, 200);
  }),

  deleteProduct: asyncHandler(async (req, res) => {
    const data = await productService.deleteById(req.user, req.params.id);
    return sendSuccess(res, "Xoá sản phẩm thành công", data, 200);
  }),
};

export default productController;
