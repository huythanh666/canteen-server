import express from "express";
import {
  checkRolePermission,
  requireAuth,
} from "../../middlewares/auth.middleware.js";
import inventoryController from "./inventory.controller.js";
import { validate } from "../../middlewares/zod.middleware.js";
import { inventoryTransactionSchema } from "./inventory.schema.js";

const inventoryRoute = express.Router();
inventoryRoute.use(requireAuth);
inventoryRoute.get("/getAllInventory", inventoryController.getAllInventory);
inventoryRoute.get("/getAllTransaction", inventoryController.getAllTransaction);

inventoryRoute.use(checkRolePermission);
inventoryRoute.post(
  "/createTransaction",
  validate(inventoryTransactionSchema),
  inventoryController.createTransaction,
);
inventoryRoute.get(
  "/getDetailProduct/:id",
  inventoryController.getDetailProduct,
);

inventoryRoute.get("/report", inventoryController.getDailyReport);

export default inventoryRoute;
