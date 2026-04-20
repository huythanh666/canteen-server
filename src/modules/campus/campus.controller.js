import asyncHandler from "../../utils/asyncHandler.util.js"
import { sendSuccess, throwError } from "../../utils/response.util.js"
import campusService from "./campus.service.js"

const campusController = {
    createCampus: asyncHandler(async (req,res) => {
        if (!req.body.name) {
            throwError("Tên campus là bắt buộc", 400)
        }
        const data = await campusService.create(req.body);
        return sendSuccess(res,"Tạo thành thông campus",data,201)
    }),
    getAllCampus: asyncHandler(async (req,res) => {
        const data = await campusService.getAllCampus();
        return sendSuccess(res,"Lấy dữ liệu thành công",data,200)
    })
}


export default campusController