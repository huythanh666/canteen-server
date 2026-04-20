export const AUTH_ERRORS = {
    EMAIL_ALREADY_EXISTS: { message: "Email này đã được sử dụng.", statusCode: 400 },
    INVALID_CREDENTIALS: { message: "Email hoặc mật khẩu không chính xác.", statusCode: 401 },
    USER_NOT_FOUND: { message: "Người dùng không tồn tại.", statusCode: 404 },
    ACCOUNT_LOCKED: { message: "Tài khoản của bạn đã bị khóa.", statusCode: 403 },
    REFRESH_TOKEN_NOT_FOUND: { message: "Không tìm thấy refresh token", statusCode: 400 },
    INVALID_ROLE: { message: "Bạn không đủ quyền hạn", statusCode: 400 },

};