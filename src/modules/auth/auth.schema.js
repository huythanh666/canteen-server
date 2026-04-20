import { z } from "zod";

export const signupSchema = z.object({
    name: z.string().min(1, "Tên không được để trống").min(4,"Tên không được ít hơn 4 ký tự").max(20,"Tên không được vượt quá 20 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải từ 6 ký tự").max(20,"Mật khẩu không được vượt quá 20 ký tự"),
    campus_id: z.string().uuid("Campus ID phải là định dạng UUID"), 
    canteen_id: z.string().uuid("Canteen ID phải là định dạng UUID"),
    birthday: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Ngày sinh không đúng định dạng ISO",
    }),
});

export const signinSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
});