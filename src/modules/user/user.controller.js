import asyncHandler from "../../utils/asyncHandler.util.js";
import { sendSuccess } from "../../utils/response.util.js";
import userService from "./user.service.js";

const userController = {
  getListUser: asyncHandler(async (req, res) => {
    const data = await userService.getList(req.user);
    return sendSuccess(res, "Lấy danh sách thành công", data, 200);
  }),
  getUserById: asyncHandler(async (req, res) => {
    const data = await userService.getUser(req.params.id, req.user);
    return sendSuccess(res, "Lấy danh sách thành công", data, 200);
  }),
  deleteUserById: asyncHandler(async (req, res) => {
    const data = await userService.deleteUser(req.params.id, req.user);
    return sendSuccess(res, "Xoá nhân viên thành công", data, 200);
  }),
  updateUserById: asyncHandler(async (req, res) => {
    const data = await userService.updateUser(
      req.params.id,
      req.user,
      req.body,
    );
    return sendSuccess(res, "Cập nhập nhân viên thành công", data, 200);
  }),
};

export default userController;
