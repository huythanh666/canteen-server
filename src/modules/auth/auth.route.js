import express from "express";
import authControler from "./auth.controller.js";
import { validate } from "../../middlewares/zod.middleware.js";
import { signinSchema, signupSchema } from "./auth.schema.js";
import {
  optionalAuth,
  requireAuth,
} from "../../middlewares/auth.middleware.js";
import { verifyAccessToken } from "../../utils/jwt.util.js";

const authRoute = express.Router();

authRoute.post("/refreshToken", authControler.refreshToken);
authRoute.post(
  "/signup",
  validate(signupSchema),
  requireAuth,
  authControler.signup,
);

authRoute.post("/signin", validate(signinSchema), authControler.signin);

authRoute.post("/signout", requireAuth, authControler.signout);

authRoute.get("/me", requireAuth, authControler.getPingMe);

export default authRoute;
