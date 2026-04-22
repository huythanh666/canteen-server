import { z } from "zod";

export const inventoryTransactionSchema = z
  .object({
    product_id: z.string().uuid("Product ID không hợp lệ"),
    inventory_id: z.string().uuid("Inventory ID không hợp lệ"),
    staff_id: z.string().uuid("Staff ID không hợp lệ"),
    quantity: z.coerce.number({
      invalid_type_error: "Số lượng phải là con số",
    }),
    type: z.enum(["IMPORT", "EXPORT", "WASTE", "ADJUST"], {
      errorMap: () => ({ message: "Loại giao dịch không hợp lệ" }),
    }),
    unit: z.enum(["phần", "kg"]).default("kg"),
    cost_price: z.coerce.number().min(0).optional().default(0),
    description: z.string().max(500, "Mô tả quá dài").optional().nullable(),
    order_id: z.string().uuid().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.type !== "ADJUST" && data.quantity <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Với loại ${data.type}, số lượng phải lớn hơn 0`,
        path: ["quantity"],
      });
    }

    if (
      data.type === "ADJUST" &&
      (!data.description || data.description.trim().length < 5)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Khi điều chỉnh kho (ADJUST), vui lòng nhập lý do cụ thể (ít nhất 5 ký tự)",
        path: ["description"],
      });
    }

    if (data.type === "ADJUST" && data.quantity === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Số lượng điều chỉnh không được bằng 0",
        path: ["quantity"],
      });
    }
  });
