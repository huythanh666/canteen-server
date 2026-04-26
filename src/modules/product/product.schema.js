import { z } from "zod";

export const productSchema = z.object({
  product_name: z
    .string()
    .min(1, "Tên sản phẩm không được để trống")
    .max(20, "Tên sản phẩm không vượt quá 20 ký tự"),

  price: z.number().min(0, "Giá không được âm").optional().default(0),

  unit: z
    .string()
    .min(1, "khối lượng không được để trống")
    .max(5, "khối lượng không vượt quá 5 ký tự"),

  protein: z.number().min(0).optional().default(0),
  fat: z.number().min(0).optional().default(0),
  calo: z.number().min(0).optional().default(0),

  is_subscription: z.boolean().optional(),
  is_selling: z.boolean().optional(),
  is_available: z.boolean().optional(),
});
