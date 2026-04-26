import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess } from "../../utils/response.util.js";
import reviewCommentService from "./reviewComment.service.js";

const reviewCommentController = {
  createComment: asyncHandler(async (req, res) => {
    const data = await reviewCommentService.createComment(
      req.body,
      req.user,
      req.file,
    );
    return sendSuccess(res, "Comment thành công", data, 200);
  }),
  getAllComment: asyncHandler(async (req, res) => {
    const data = await reviewCommentService.getAllComment(req.params.id);
    return sendSuccess(res, "Lấy danh sách comment thành công", data, 200);
  }),
};

export default reviewCommentController;
