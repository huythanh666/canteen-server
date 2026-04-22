import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import orderController from "./order.controller.js";

const orderRoute = express.Router();

orderRoute.use(requireAuth);
orderRoute.get("/getAllOrder", orderController.getAllOrder);
orderRoute.get("/getOrderDetail/:id", orderController.getOrderDetail);
orderRoute.post("/createOrder", orderController.createOrder);
orderRoute.get("/getHistory", orderController.getHistory);
orderRoute.put("/cancelOrder/:id", orderController.cancelOrder);
orderRoute.get("/report", orderController.report);

export default orderRoute;
