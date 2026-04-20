import asyncHandler from "../../utils/asyncHandler.util.js";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../../utils/cookies.util.js";
import { sendSuccess } from "../../utils/response.util.js";
import authService from "./auth.service.js";

const authControler = {
    
    signup: asyncHandler(async (req,res,next) => { 
        const {user,accessToken,refreshToken} = await authService.signup(req.body);
        setRefreshTokenCookie(res, refreshToken);
        const data = {user,accessToken};
        return sendSuccess(res,"Đăng ký thành công", data, 201);
    }),
    
    signin: asyncHandler(async (req,res,next) => { 
        const {user,accessToken,refreshToken} = await authService.signin(req.body);
        setRefreshTokenCookie(res, refreshToken);
        const data = {user,accessToken};
        return sendSuccess(res,"Đăng nhập thành công", data, 200);
    }),
   
    signout: asyncHandler(async (req,res,next) => { 
        const { refreshToken } = req.cookies;
        clearRefreshTokenCookie(res);
        return sendSuccess(res,"Đăng xuất thành công", null ,201);

    })
}

export default authControler