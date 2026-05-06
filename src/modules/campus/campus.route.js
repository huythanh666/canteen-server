import express from "express";
import campusController from "./campus.controller.js";
import { validate } from "../../middlewares/zod.middleware.js";
import { createCampusSchema } from "./campus.schema.js";

const campusRoute = express.Router();

campusRoute.post(
  "/createCampus",
  validate(createCampusSchema),
  campusController.createCampus,
);
campusRoute.get("/getAllCampus", campusController.getAllCampus);

export default campusRoute;
/*

{
        "id": "c2b2d99c-8aea-4c00-8a70-accbde8a3a35",
        "campus_id": "0d06e3d4-1efb-4e7f-9e96-fc3993c13627",
        "canteen_id": "bf48217b-1410-47f7-94d5-1fdde0c8c0db",
        "name": "Huy Thành",
        "email": "huythanh022302@gmail.com",
        "password": "$2b$12$Hk.MDoIXmzqmY0qZAHYlMuHaJq9tsZ5x7bbiKBlMVPdkBPD7GMaaK",
        "role": "SUPER_ADMIN",
        "birthday": "2002-02-23T00:00:00.000Z",
        "status": "ACTIVE",
        "email_parents": "dev.nguyenhuythanh@gmail.com",
        "created_at": "2026-04-20T08:03:39.000Z",
        "updated_at": "2026-04-20T08:03:39.000Z",
        "canteen": {
            "id": "bf48217b-1410-47f7-94d5-1fdde0c8c0db",
            "campus_id": "0d06e3d4-1efb-4e7f-9e96-fc3993c13627",
            "name": "Canteen PTIT HCM CS1",
            "address": "97 Man Thiện, Hiệp Phú, Tăng Nhơn Phú, Hồ Chí Minh 70000, Việt Nam",
            "image": "https://res.cloudinary.com/da9vcwgbn/image/upload/v1776628284/1_vsizru.jpg"
        }
    }
*/
