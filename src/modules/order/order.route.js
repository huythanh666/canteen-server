import express from "express";
import {
  checkBussinessPermission,
  checkRolePermission,
  requireAuth,
} from "../../middlewares/auth.middleware.js";
import orderController from "./order.controller.js";

const orderRoute = express.Router();

orderRoute.use(requireAuth);
orderRoute.post("/createOrder", orderController.createOrder);
orderRoute.get("/my-history", orderController.getMyHistory);
orderRoute.get("/historyOrder", orderController.getHistoryOrder);
orderRoute.get("/getOrderDetail/:id", orderController.getOrderDetail);
orderRoute.use(checkBussinessPermission);
orderRoute.get("/getAllOrder", orderController.getAllOrder);
orderRoute.put("/updateOrder/:id", orderController.updateOrder);
orderRoute.use(checkRolePermission);
orderRoute.get("/report", orderController.report);

export default orderRoute;
