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

inventoryRoute.post("/createInventory", inventoryController.createInventory);
inventoryRoute.post(
  "/createTransaction",
  validate(inventoryTransactionSchema),
  inventoryController.createTransaction,
);
inventoryRoute.get(
  "/getDetailInventory/:id",
  inventoryController.getDetailInventory,
);

inventoryRoute.get("/report", inventoryController.getDailyReport);

export default inventoryRoute;
