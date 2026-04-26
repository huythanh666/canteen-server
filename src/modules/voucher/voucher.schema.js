import { z } from "zod";

export const voucherSchema = z
  .object({
    code: z
      .string()
      .min(3, "Mã voucher phải ít nhất 3 ký tự")
      .max(50, "Mã voucher quá dài")
      .toUpperCase()
      .trim(),
    discount_value: z.number().positive("Giá trị giảm giá phải lớn hơn 0"),
    discount_type: z.enum(["PERCENT", "FIXED"], {
      errorMap: () => ({ message: "Loại giảm giá phải là PERCENT hoặc FIXED" }),
    }),

    min_order_value: z
      .number()
      .nonnegative("Giá trị đơn hàng tối thiểu không được âm")
      .optional()
      .default(0),

    max_discount: z
      .number()
      .nonnegative("Mức giảm tối đa không được âm")
      .optional(),

    start_date: z.coerce.date({
      required_error: "Vui lòng chọn ngày bắt đầu",
    }),

    end_date: z.coerce.date({
      required_error: "Vui lòng chọn ngày kết thúc",
    }),

    usage_limit: z
      .number()
      .int("Số lượng phải là số nguyên")
      .positive("Số lượng sử dụng phải ít nhất là 1")
      .optional(),

    is_active: z.boolean().optional().default(true),
  })

  .refine((data) => data.end_date > data.start_date, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["end_date"],
  })
  .refine(
    (data) => {
      if (data.discount_type === "PERCENT") {
        return data.discount_value <= 100;
      }
      return true;
    },
    {
      message: "Giảm giá theo phần trăm không được vượt quá 100%",
      path: ["discount_value"],
    },
  );
