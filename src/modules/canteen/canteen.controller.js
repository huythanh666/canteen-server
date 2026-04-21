import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess, throwError } from "../../utils/response.util.js";
import canteenService from "./canteen.service.js";

const canteenController = {
  createCanteen: asyncHandler(async (req, res) => {
    if (!req.body.campus_id) {
      throwError("Canteen này thuộc về campus nào?", 401);
    }
    const data = await canteenService.create(req.body);
    return sendSuccess(res, "Tạo canteen thành công", data, 201);
  }),

  getAllCanteen: asyncHandler(async (req, res) => {
    const data = await canteenService.getAll();
    return sendSuccess(res, "Lấy danh sách canteen thành công", data, 201);
  }),
};
export default canteenController;
