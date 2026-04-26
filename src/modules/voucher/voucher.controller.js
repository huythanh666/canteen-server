import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess } from "../../utils/response.util.js";
import voucherService from "./voucher.service.js";

const voucherController = {
  getAllVoucher: asyncHandler(async (req, res) => {
    const data = await voucherService.getAll();
    return sendSuccess(res, "Lấy danh sách voucher thành công", data, 200);
  }),
  getVoucherDetail: asyncHandler(async (req, res) => {
    const data = await voucherService.getDetail(req.params.id);
    return sendSuccess(res, "Lấy thông tin chi tiết thành công", data, 200);
  }),

  saveVoucher: asyncHandler(async (req, res) => {
    const data = await voucherService.saveVoucher(req.params.id, req.user);
    return sendSuccess(res, "Đã lưu voucher vào ví thành công", data, 200);
  }),

  getMyVoucher: asyncHandler(async (req, res) => {
    const data = await voucherService.getMyVoucher(req.user);
    return sendSuccess(res, "Lấy thành công danh sách voucher", data, 200);
  }),

  createVoucher: asyncHandler(async (req, res) => {
    const data = await voucherService.createVoucher(req.body);
    return sendSuccess(res, "Tạo voucher thành công", data, 200);
  }),
  updateVoucher: asyncHandler(async (req, res) => {
    const data = await voucherService.updateVoucher(req.params.id);
    return sendSuccess(res, "Xoá voucher thành công", data, 200);
  }),
};

export default voucherController;
