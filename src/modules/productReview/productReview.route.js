import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import productReviewController from "./productReview.controller.js";
import uploadImage from "../../middlewares/cloudinary.middleware.js";

const productReviewRoute = express.Router();
productReviewRoute.use(requireAuth);

productReviewRoute.post(
  "/createReview",
  uploadImage("image"),
  productReviewController.createReview,
);
productReviewRoute.get(
  "/getAllReview/:id",
  productReviewController.getAllReview,
);

export default productReviewRoute;
