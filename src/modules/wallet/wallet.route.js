import express from "express";
import {
  checkBussinessPermission,
  checkRolePermission,
  requireAuth,
} from "../../middlewares/auth.middleware.js";
import walletController from "./wallet.controller.js";

const walletRoute = express.Router();

walletRoute.use(requireAuth);
walletRoute.get("/myWallet", walletController.getDetailWallet);
walletRoute.post(
  "/deposit",
  checkBussinessPermission,
  walletController.depositWallet,
);

walletRoute.use(checkRolePermission);
walletRoute.get("/getAllTransaction", walletController.getTransactionWallet);
walletRoute.get("/getAllWallet", walletController.getAllWallet);
walletRoute.get("/report", walletController.getWalletReport);

walletRoute.post("/refund/:id", walletController.refundWallet);

export default walletRoute;
