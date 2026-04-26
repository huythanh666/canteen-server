import { z } from "zod";

export const inventoryTransactionSchema = z
  .object({
    inventory_id: z.string().uuid("Nguyên liệu không hợp lệ"),
    staff_id: z.string().uuid("Nhân viên không hợp lệ"),
    quantity: z.coerce.number({
      invalid_type_error: "Số lượng phải là con số",
    }),
    type: z.enum(["IMPORT", "EXPORT", "WASTE", "ADJUST"], {
      errorMap: () => ({ message: "Loại giao dịch không hợp lệ" }),
    }),
    description: z.string().max(500, "Mô tả quá dài").optional().nullable(),
    order_id: z.string().uuid("Đơn hàng không hợp lệ").optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (
      ["IMPORT", "EXPORT", "WASTE"].includes(data.type) &&
      data.quantity <= 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Với loại ${data.type}, số lượng phải lớn hơn 0`,
        path: ["quantity"],
      });
    }

    if (data.type === "ADJUST") {
      if (!data.description || data.description.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Khi điều chỉnh kho (ADJUST), vui lòng nhập lý do cụ thể (ít nhất 5 ký tự)",
          path: ["description"],
        });
      }
      if (data.quantity === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Số lượng điều chỉnh không được bằng 0 (có thể âm để giảm, dương để tăng)",
          path: ["quantity"],
        });
      }
    }
  });
