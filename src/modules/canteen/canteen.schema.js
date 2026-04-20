import {z} from "zod";

export const createCanteenSchema = z.object({
    name: z.string()
            .trim()
            .min(1,"Tên canteen không được để trống")
            .min(10,"Tên canteen phải có ít nhất 10 ký tự")
            .max(100,"Tên canteen quá dài"),
    address:   z.string()
                .trim()
                .min(1,"Địa chỉ không được để trống")
                .min(10,"Địa chỉ phải có ít nhất 10 ký tự")
                .max(100,"Địa chỉ quá dài")
})