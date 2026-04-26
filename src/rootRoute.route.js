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
