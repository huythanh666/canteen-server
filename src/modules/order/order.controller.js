import asyncHandler from "../../utils/asyncHandler.util.js";
import orderService from "./order.service.js";

const orderController = {
  getAllOrder: asyncHandler(async (req, res) => {
    const data = await orderService.getAll(req.user);
    return sendSuccess(res, "Lấy danh sách thành công", data, 200);
  }),
  getOrderDetail: asyncHandler(async (req, res) => {
    const data = await orderService.getDetail(req.user);
    return sendSuccess(res, "Lấy chi tiết đơn hàng thành công", data, 200);
  }),
  createOrder: asyncHandler(async (req, res) => {
    const data = await orderService.create(req.user);
    return sendSuccess(res, "Tạo đơn hàng thành công", data, 200);
  }),
  getHistory: asyncHandler(async (req, res) => {
    const data = await orderService.getHistory(req.user);
    return sendSuccess(res, "Lấy lịch sử thành công", data, 200);
  }),
  cancelOrder: asyncHandler(async (req, res) => {
    const data = await orderService.cancel(req.user);
    return sendSuccess(res, "Huỷ đơn hàng thành công", data, 200);
  }),
  report: asyncHandler(async (req, res) => {
    const data = await orderService.report(req.user);
    return sendSuccess(res, "Tạo báo cáo thành công", data, 200);
  }),
};

export default orderController;
