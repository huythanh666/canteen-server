import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess } from "../../utils/response.util.js";
import inventoryService from "./inventory.service.js";

const inventoryController = {
  getAllInventory: asyncHandler(async (req, res) => {
    const data = await inventoryService.getAllInventory(req.user);
    return sendSuccess(res, "Lấy danh sách kho hàng thành công", data, 200);
  }),
  getAllTransaction: asyncHandler(async (req, res) => {
    const data = await inventoryService.getAll(req.user);
    return sendSuccess(res, "Lấy danh sách giao dịch thành công", data, 200);
  }),
  createTransaction: asyncHandler(async (req, res) => {
    const data = await inventoryService.create(req.user, req.body);
    return sendSuccess(res, "Tạo giao dịch thành công", data, 200);
  }),
  getDetailProduct: asyncHandler(async (req, res) => {
    const data = await inventoryService.getDetail(req.user, req.params.id);
    return sendSuccess(res, "Lấy danh sách thành công", data, 200);
  }),
  getDailyReport: asyncHandler(async (req, res) => {
    const data = await inventoryService.getDailyReport(req.user, req.query);
    return sendSuccess(res, "Lấy báo cáo thành công", data, 200);
  }),
};

export default inventoryController;
