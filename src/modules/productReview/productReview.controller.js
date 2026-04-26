import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess } from "../../utils/response.util.js";
import productReviewService from "./productReview.service.js";

const productReviewController = {
  createReview: asyncHandler(async (req, res) => {
    const data = await productReviewService.createReview(
      req.body,
      req.user,
      req.file,
    );
    return sendSuccess(res, "Comment thành công", data, 200);
  }),
  getAllReview: asyncHandler(async (req, res) => {
    const data = await productReviewService.getAllReview(req.params.id);
    return sendSuccess(res, "Comment thành công", data, 200);
  }),
};

export default productReviewController;
