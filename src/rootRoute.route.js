import express from "express";
import campusRoute from "./modules/campus/campus.route.js";
import authRoute from "./modules/auth/auth.route.js";
import canteenRoute from "./modules/canteen/canteen.route.js";
import userRoute from "./modules/user/user.route.js";
import productRoute from "./modules/product/product.route.js";

const rootRoute = express.Router();
rootRoute.use("/campus", campusRoute);
rootRoute.use("/canteen", canteenRoute);
rootRoute.use("/user", userRoute);
rootRoute.use("/auth", authRoute);
rootRoute.use("/product", productRoute);

export default rootRoute;
