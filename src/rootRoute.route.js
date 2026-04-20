import express from "express";
import campusRoute from "./modules/campus/campus.route.js";
import authRoute from "./modules/auth/auth.route.js";
import canteenRoute from "./modules/canteen/canteen.route.js";

const rootRoute = express.Router();
rootRoute.use("/campus", campusRoute)
rootRoute.use("/canteen", canteenRoute)
rootRoute.use("/auth", authRoute)

export default rootRoute