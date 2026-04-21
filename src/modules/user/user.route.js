import express from "express";
import userController from "./user.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const userRoute = express.Router();

userRoute.use(requireAuth);

userRoute.get("/getListUser", userController.getListUser);

userRoute.get("/getUserById/:id", userController.getUserById);

userRoute.delete("/deleteUserById/:id", userController.deleteUserById);

userRoute.put("/updateUserById/:id", userController.updateUserById);

export default userRoute;
