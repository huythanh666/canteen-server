import { AUTH_ERRORS } from "../../constant/errorMessage.contstant.js";
import prisma from "../../prisma/client.js";
import { throwError } from "../../utils/response.util.js";

const voucherService = {
  getAll: async () => {
    return await prisma.voucher.findMany();
  },
  getDetail: async (voucherId) => {
    return await prisma.voucher.findUnique({ where: { id: voucherId } });
  },
  saveVoucher: async (voucherId, user) => {
    const { id, canteen_id } = user;
    return await prisma.$transaction(async (tx) => {
      const isVoucher = await tx.voucher.findUnique({
        where: { id: voucherId },
      });
      if (!isVoucher || isVoucher.is_active === false)
        throwError(AUTH_ERRORS.INVALID_VOUCHER);
      const isVoucherUserHas = await tx.voucher_user.findFirst({
        where: { user_id: id, voucher_id: voucherId },
      });
      if (isVoucherUserHas) throwError(AUTH_ERRORS.VOUCHER_ALREADY_SAVED);

      const data = await tx.voucher_user.create({
        data: {
          user_id: id,
          voucher_id: isVoucher.id,
          status: "AVAILABLE",
        },
      });
      return data;
    });
  },
  getMyVoucher: async (user) => {
    const { id } = user;
    const listVoucher = await prisma.voucher_user.findMany({
      where: {
        user_id: id,
      },
      include: {
        voucher: {
          select: {
            code: true,
            discount_value: true,
            discount_type: true,
            min_order_value: true,
            max_discount: true,
          },
        },
      },
    });
    const data = listVoucher.map(({ voucher, ...e }) => {
      return {
        ...e,
        ...voucher,
      };
    });
    return data;
  },

  createVoucher: async (data) => {
    const {
      code,
      discount_value,
      discount_type,
      min_order_value,
      max_discount,
      start_date,
      end_date,
      usage_limit,
      is_active,
    } = data;

    return await prisma.voucher.create({
      data: {
        code,
        discount_value,
        discount_type,
        min_order_value,
        max_discount,
        start_date,
        end_date,
        usage_limit,
        is_active,
      },
    });
  },
  updateVoucher: async (voucherId) => {
    const isVoucher = await prisma.voucher.findUnique({
      where: { id: voucherId },
    });
    if (!isVoucher) throwError(AUTH_ERRORS.INVALID_VOUCHER);
    const isActive = isVoucher.is_active;
    return await prisma.voucher.update({
      where: { id: voucherId },
      data: {
        is_active: !isActive,
      },
    });
  },
};
export default voucherService;
