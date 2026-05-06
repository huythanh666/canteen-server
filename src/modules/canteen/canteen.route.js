import express from "express";
import canteenController from "./canteen.controller.js";
import { validate } from "../../middlewares/zod.middleware.js";
import { createCanteenSchema } from "./canteen.schema.js";

const canteenRoute = express.Router();

canteenRoute.post(
  "/createCanteen",
  validate(createCanteenSchema),
  canteenController.createCanteen,
);
canteenRoute.get("/getAllCanteen", canteenController.getAllCanteen);
export default canteenRoute;
