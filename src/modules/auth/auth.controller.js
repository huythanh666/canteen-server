import { AUTH_ERRORS } from "../../constant/errorMessage.contstant.js";
import asyncHandler from "../../utils/asyncHandler.util.js";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../../utils/cookies.util.js";
import { generateAccessToken, verifyRefreshToken } from "../../utils/jwt.util.js";
import { sendSuccess, throwError } from "../../utils/response.util.js";
import authService from "./auth.service.js";

const authControler = {

    signup: asyncHandler(async (req,res) => { 
        const {role} = req?.user || {role: "STUDENT"};
        const {user, accessToken, refreshToken} = await authService.signup(req.body,role);
        setRefreshTokenCookie(res, refreshToken);
        const data = {user,accessToken};
        return sendSuccess(res,"Đăng ký thành công", data, 201);
    }),
    
    signin: asyncHandler(async (req,res) => { 
        const {user,accessToken,refreshToken} = await authService.signin(req.body);
        setRefreshTokenCookie(res, refreshToken);
        const data = {user,accessToken};
        return sendSuccess(res,"Đăng nhập thành công", data, 200);
    }),
   
    signout: asyncHandler(async (req,res) => { 
        clearRefreshTokenCookie(res);
        return sendSuccess(res,"Đăng xuất thành công", null ,200);

    }),

    refreshToken: asyncHandler(async (req,res) => { 
        const { refreshToken } = req.cookies;
         if (!refreshToken) {
            return throwError(AUTH_ERRORS.REFRESH_TOKEN_NOT_FOUND);
        }
        const decoded = await verifyRefreshToken(refreshToken);
        const payloadToken = {
            id: decoded.id,
            role: decoded.role,
            status: decoded.status,
            campus_id: decoded.campus_id,
            canteen_id: decoded.canteen_id,
        };
        const accessToken = await generateAccessToken(payloadToken);
        return sendSuccess(res,"Tạo access token thành công", { accessToken } ,200);
    })
    
}
export default authControler