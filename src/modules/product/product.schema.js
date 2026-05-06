// product.schema.js
import { z } from "zod";

export const productSchema = z.object({
  product_name: z.string().min(1, "Tên không được để trống"),
  category: z.enum(["FOOD", "DRINK"], { message: "Sai loại" }),
  price: z.coerce.number().min(0, "Giá không được âm").optional().default(0),
  unit: z.string().min(1, "Đơn vị không được để trống"),
  protein: z.coerce.number().min(0).optional().default(0),
  fat: z.coerce.number().min(0).optional().default(0),
  calo: z.coerce.number().min(0).optional().default(0),
  is_subscription: z.coerce.boolean().optional(),
  is_selling: z.coerce.boolean().optional().default(true),
  is_available: z.coerce.boolean().optional().default(true),
});
