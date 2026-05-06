import { INVALID } from "zod/v3";

export const AUTH_ERRORS = {
  EMAIL_ALREADY_EXISTS: {
    message: "Email này đã được sử dụng.",
    statusCode: 400,
  },
  INVALID_CREDENTIALS: {
    message: "Email hoặc mật khẩu không chính xác.",
    statusCode: 401,
  },
  USER_NOT_FOUND: { message: "Người dùng không tồn tại.", statusCode: 404 },
  ACCOUNT_LOCKED: { message: "Tài khoản của bạn đã bị khóa.", statusCode: 403 },
  REFRESH_TOKEN_NOT_FOUND: {
    message: "Không tìm thấy refresh token",
    statusCode: 400,
  },
  INVALID_ROLE: { message: "Bạn không đủ quyền hạn", statusCode: 403 },
  DETAIL_PRODUCT: { message: "Món này bán lẻ", statusCode: 403 },
  NO_DATA: { message: "Không tìm thấy sản phẩm này", statusCode: 400 },
  FAKE_ACCOUNT: { message: "Hãy dùng account của mình", statusCode: 400 },
  WRONG_TYPE: { message: "Sai phân loại", statusCode: 400 },
  INVALID_VALUE: {
    message: "Số lượng hàng trong kho không đủ để thực hiện xoá",
    statusCode: 400,
  },
  INVALID_BALANCE: {
    message: "Số dư trong ví không đủ",
    statusbar: 400,
  },
  PRICE_MISMATCH: {
    message: "Tổng tiền không khớp",
    statusbar: 400,
  },
  OUT_OF_STOCK: {
    message: "Hàng trong kho không đủ",
    statusbar: 400,
  },
  WRONG_CANTEEN: {
    message: "Đặt hàng sai canteen",
    statusbar: 400,
  },
  WRONG_WALLET: {
    message: "Không tìm thấy ví",
    statusbar: 400,
  },
  INVALID_QUANTITY: {
    message: "Số lượng không được nhỏ hơn hoặc bằng 0",
    statusbar: 400,
  },
  INVALID_ORDER: {
    message: "Không tìm thấy hoá đơn này",
    statusbar: 400,
  },
  INVALID_STATUS_ORDER: {
    message: "Không tìm thấy hoá đơn này",
    statusbar: 400,
  },
  INVALID_VOUCHER: {
    message: "Không tìm thấy mã giảm giá này",
    statusbar: 400,
  },
  INVALID_MIN_ORDER_VALUE: {
    message: "Mã giảm giá không áp dụng cho hoá đơn có giá trị thấp",
    statusbar: 400,
  },
  VOUCHER_ALREADY_SAVED: {
    message: "Bạn đã lưu mã này vào ví rồi",
    statusbar: 400,
  },
  INVALID_STATUS_ORDER: {
    message: "Trạng thái đơn không hợp lệ",
    statusbar: 400,
  },
  INVALID_REVIEW: {
    message: "Không tìm thấy review món này",
    statusbar: 400,
  },
  REVIEW_ALREADY_EXISTS: {
    message: "Bạn đã review món ăn này rồi",
    statusbar: 400,
  },
  INVALID_RECIPE: {
    message: "Bạn chưa thêm công thức cho món này",
    statusbar: 400,
  },
};
