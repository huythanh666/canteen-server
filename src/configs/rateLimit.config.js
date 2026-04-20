const loginLimit = {
    windowMs: 60 * 60 * 1000, 
    limit: 5, 
    message: "Quá nhiều lần thử đăng nhập, vui lòng quay lại sau 1 tiếng."
}
const orderLimit = {
    windowMs: 2 * 1000, 
    limit: 1, // 
    standardHeaders: 'draft-7', 
    legacyHeaders: false, 
    message: {
        status: 429,
        message: "Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau 2 giây."
    }
}

export {loginLimit,orderLimit}