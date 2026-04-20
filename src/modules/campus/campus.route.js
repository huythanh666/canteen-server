import express from "express";
import campusController from "./campus.controller.js";
import { validate } from "../../middlewares/zod.middleware.js";
import { createCampusSchema } from "./campus.schema.js";

const campusRoute = express.Router();


campusRoute.post("/create",validate(createCampusSchema),campusController.createCampus)
campusRoute.get("/getAllCampus",campusController.getAllCampus)

export default campusRoute