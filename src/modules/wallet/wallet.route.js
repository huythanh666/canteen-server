import express from "express";
import {
  checkBussinessPermission,
  checkRolePermission,
  requireAuth,
} from "../../middlewares/auth.middleware.js";
import walletController from "./wallet.controller.js";

const walletRoute = express.Router();

walletRoute.use(requireAuth);
walletRoute.get("/myWallet/:id", walletController.getDetailWallet);
// hiển thị thông tin chi tiết ví + toàn bộ lịch sử giao dịch của ví người dùng
walletRoute.post(
  "/deposit",
  checkBussinessPermission,
  walletController.depositWallet,
);
// nạp tiền

walletRoute.use(checkRolePermission);
walletRoute.get("/getAllTransaction", walletController.getTransactionWallet);
// hiện thị toàn bộ loại giao dịch nạp/rút/thanh toán hoá đơn tại canteen đó
walletRoute.get("/getAllWallet", walletController.getAllWallet);
// hiển thị toàn bộ danh sách ví nằm trong canteen
walletRoute.post("/refund/:id", walletController.refundWallet);
// tạo lệnh hoàn tiền

export default walletRoute;
