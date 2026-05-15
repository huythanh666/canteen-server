import express from "express";
import campusRoute from "./modules/campus/campus.route.js";
import authRoute from "./modules/auth/auth.route.js";
import canteenRoute from "./modules/canteen/canteen.route.js";
import userRoute from "./modules/user/user.route.js";
import productRoute from "./modules/product/product.route.js";
import inventoryRoute from "./modules/inventory/inventory.route.js";
import orderRoute from "./modules/order/order.route.js";
import walletRoute from "./modules/wallet/wallet.route.js";
import voucherRoute from "./modules/voucher/voucher.route.js";
import productReviewRoute from "./modules/productReview/productReview.route.js";
import reviewCommentRoute from "./modules/reviewComment/reviewComment.route.js";

const rootRoute = express.Router();
/*
"Modular Routing"
Global Prefix (/api/v1): Được định nghĩa ở server.js. Đây là cách bạn đánh số phiên bản cho API (v1, v2...).
Route Module Prefix (/campus): Được định nghĩa ở rootRoute.js. Đây là phần phân loại tài nguyên (tất cả những gì liên quan đến Campus đều nằm ở đây).
Resource Path/Handler (/createCampus): Được định nghĩa ở campus.route.js. Đây là "hành động" hoặc "địa chỉ đích" cụ thể mà bạn muốn gọi.
*Global Prefix (/api/v1) là một đoạn đường dẫn cố định được thêm vào trước các URL endpoint của API để giúp quản lý phiên bản và tổ chức
*các route một cách rõ ràng hơn. Ví dụ, nếu bạn có một endpoint để tạo campus là /createCampus, 
*khi sử dụng Global Prefix, endpoint đó sẽ trở thành /api/v1/campus/createCampus. Điều này giúp bạn dễ dàng quản lý và phát triển API
*theo từng phiên bản mà không ảnh hưởng đến các phiên bản cũ đã tồn tại.
*/
rootRoute.use("/campus", campusRoute);
rootRoute.use("/canteen", canteenRoute);
rootRoute.use("/user", userRoute);
rootRoute.use("/auth", authRoute);
rootRoute.use("/product", productRoute);
rootRoute.use("/inventory", inventoryRoute);
rootRoute.use("/wallet", walletRoute);
rootRoute.use("/order", orderRoute);
rootRoute.use("/voucher", voucherRoute);
rootRoute.use("/review", productReviewRoute);
rootRoute.use("/comment", reviewCommentRoute);

export default rootRoute;
