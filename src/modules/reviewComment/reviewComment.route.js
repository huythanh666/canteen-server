import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import uploadImage from "../../middlewares/cloudinary.middleware.js";
import reviewCommentController from "./reviewComment.controller.js";

const reviewCommentRoute = express.Router();

reviewCommentRoute.use(requireAuth);

reviewCommentRoute.post(
  "/createComment",
  uploadImage("image"),
  reviewCommentController.createComment,
);
reviewCommentRoute.get(
  "/getAllComment/:id",
  reviewCommentController.getAllComment,
);

export default reviewCommentRoute;
