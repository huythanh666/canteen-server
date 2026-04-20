import express from "express";
import authControler from "./auth.controller.js";
import { validate } from "../../middlewares/zod.middleware.js";
import { signinSchema, signupSchema } from "./auth.schema.js";
import { optionalAuth, requireAuth } from "../../middlewares/auth.middleware.js";

const authRoute = express.Router();

authRoute.post("/signup", validate(signupSchema), optionalAuth , authControler.signup)

authRoute.post("/signin",validate(signinSchema) ,authControler.signin)

authRoute.post("/signout", authControler.signout)

authRoute.post("/refreshToken", authControler.refreshToken)


export default authRoute