import { z } from "zod";
const ProductCategory = z.enum(["FOOD", "DRINK", "SNACK", "MATERIAL"]);

const UnitEnum = z.enum(["phần", "kg"], {
  errorMap: () => ({ message: "Đơn vị tính chỉ được chọn 'phần' hoặc 'kg'" }),
});
export const productSchema = z.object({
  product_name: z
    .string()
    .min(1, "Tên sản phẩm không được để trống")
    .max(20, "Tên sản phẩm không vượt quá 20 ký tự"),

  category: ProductCategory,

  price: z.number().min(0, "Giá không được âm").optional().default(0),

  unit: UnitEnum.default("kg"),

  protein: z.number().min(0).optional().default(0),
  fat: z.number().min(0).optional().default(0),
  calo: z.number().min(0).optional().default(0),

  is_subscription: z.boolean().optional().default(true),
  is_selling: z.boolean().optional().default(true),
  is_available: z.boolean().optional().default(true),
});
