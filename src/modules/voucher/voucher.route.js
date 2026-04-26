import express from "express";
import {
  requireAuth,
  superAdminPermission,
} from "../../middlewares/auth.middleware.js";
import voucherController from "./voucher.controller.js";
import { validate } from "../../middlewares/zod.middleware.js";
import { voucherSchema } from "./voucher.schema.js";

const voucherRoute = express.Router();

voucherRoute.use(requireAuth);
voucherRoute.get("/getAllVoucher", voucherController.getAllVoucher);
voucherRoute.get("/getVoucherDetail/:id", voucherController.getVoucherDetail);
voucherRoute.post("/saveVoucher/:id", voucherController.saveVoucher);
voucherRoute.get("/getMyVoucher", voucherController.getMyVoucher);
voucherRoute.use(superAdminPermission);
voucherRoute.post(
  "/createVoucher",
  validate(voucherSchema),
  voucherController.createVoucher,
);
voucherRoute.put("/updateVoucher/:id", voucherController.updateVoucher);

export default voucherRoute;
