import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess } from "../../utils/response.util.js";
import walletService from "./wallet.service.js";

const walletController = {
  getDetailWallet: asyncHandler(async (req, res) => {
    const data = await walletService.getDetail(req.user, req.params.id);
    return sendSuccess(res, "Lấy thông tin ví thành công", data, 200);
  }),
  depositWallet: asyncHandler(async (req, res) => {
    const data = await walletService.deposit(req.user, req.body);
    return sendSuccess(res, "Nạp tiền thành công", data, 200);
  }),
  getTransactionWallet: asyncHandler(async (req, res) => {
    const data = await walletService.getAllTransaction(req.user);
    return sendSuccess(
      res,
      "Lấy toàn bộ lịch sử giao dịch thành công",
      data,
      200,
    );
  }),
  getAllWallet: asyncHandler(async (req, res) => {
    const data = await walletService.getAll(req.user);
    return sendSuccess(res, "Lấy danh sách thành công", data, 200);
  }),
  refundWallet: asyncHandler(async (req, res) => {
    const data = await walletService.refund(req.user, req.params.id);
    return sendSuccess(res, "Hoàn tiền thành công", data, 200);
  }),
};

export default walletController;
