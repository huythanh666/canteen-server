import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess } from "../../utils/response.util.js";
import orderService from "./order.service.js";

const orderController = {
  createOrder: asyncHandler(async (req, res) => {
    const data = await orderService.createOrder(req.user, req.body);
    return sendSuccess(res, "Tạo đơn hàng thành công", data, 200);
  }),
  getHistory: asyncHandler(async (req, res) => {
    const data = await orderService.getHistory(req.user);
    return sendSuccess(res, "Lấy lịch sử thành công", data, 200);
  }),
  getOrderDetail: asyncHandler(async (req, res) => {
    const data = await orderService.getDetail(req.user, req.params.id);
    return sendSuccess(res, "Lấy chi tiết đơn hàng thành công", data, 200);
  }),
  getAllOrder: asyncHandler(async (req, res) => {
    const data = await orderService.getAll(req.user);
    return sendSuccess(res, "Lấy danh sách thành công", data, 200);
  }),

  updateOrder: asyncHandler(async (req, res) => {
    const data = await orderService.updateOrder(
      req.user,
      req.params.id,
      req.body,
    );
    return sendSuccess(res, "Cập nhập hoá đơn thành công", data, 200);
  }),
  report: asyncHandler(async (req, res) => {
    const data = await orderService.report(req.user, req.query);
    return sendSuccess(res, "Tạo báo cáo thành công", data, 200);
  }),
};

export default orderController;
