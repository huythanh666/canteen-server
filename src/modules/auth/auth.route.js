import express from "express";
import authControler from "./auth.controller.js";
import { validate } from "../../middlewares/zod.middleware.js";
import { signinSchema, signupSchema } from "./auth.schema.js";

const authRoute = express.Router();

authRoute.use("/signup", validate(signupSchema),authControler.signup)

authRoute.use("/signin",validate(signinSchema) ,authControler.signin)

authRoute.use("/signout", authControler.signout)


export default authRoute