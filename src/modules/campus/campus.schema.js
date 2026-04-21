import { z } from "zod";

export const createCampusSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên campus không được để trống")
    .min(10, "Tên campus phải có ít nhất 10 ký tự")
    .max(100, "Tên campus quá dài"),
});
