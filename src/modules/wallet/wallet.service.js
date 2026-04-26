import {
  BUSSINESS_PERMISSION,
  REQUIRED_ROLE_ADMIN,
} from "../../constant/auth.constant.js";
import { AUTH_ERRORS } from "../../constant/errorMessage.contstant.js";
import prisma from "../../prisma/client.js";
import { throwError } from "../../utils/response.util.js";

const walletService = {
  getDetail: async (user, idWallet) => {
    const { canteen_id, id } = user;
    const detail = await prisma.wallet.findUnique({
      where: { id: idWallet, user: { canteen_id, id } },
      include: { wallet_transaction: true },
    });
    if (!detail) throwError(AUTH_ERRORS.USER_NOT_FOUND);
    return detail;
  },
  // mới làm nạp tiền thôi
  deposit: async (user, data) => {
    const { canteen_id, role, id } = user;
    const { wallet_id, amount, type, description } = data;
    const whereCondition = {
      id: wallet_id,
    };

    if (role !== "SUPER_ADMIN") {
      whereCondition.user = { canteen_id };
    }

    const isWallet = await prisma.wallet.findUnique({
      where: whereCondition,
    });
    if (!isWallet) throwError(AUTH_ERRORS.USER_NOT_FOUND);

    if (role !== "SUPER_ADMIN") {
      const isAllowed = BUSSINESS_PERMISSION.includes(role);
      if (!isAllowed) throwError(AUTH_ERRORS.INVALID_ROLE);
    }

    const updateWallet = await prisma.$transaction(async (tx) => {
      const transactionWallet = await tx.wallet_transaction.create({
        data: { wallet_id, amount, type, description },
      });
      await tx.wallet.update({
        where: { id: wallet_id },
        data: {
          balance: { increment: amount },
        },
      });
      return transactionWallet;
    });
    return updateWallet;
  },

  getAllTransaction: async (user) => {
    const { canteen_id, role, id } = user;
    const isAllowed = REQUIRED_ROLE_ADMIN.includes(role);
    if (!isAllowed) throwError(AUTH_ERRORS.INVALID_ROLE);
    let where = {};
    if (role !== "SUPER_ADMIN") {
      where = {
        wallet: {
          user: { canteen_id: canteen_id },
        },
      };
    }
    const data = await prisma.wallet_transaction.findMany({
      where,
      include: {
        wallet: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const list = data.map(({ wallet, ...e }) => {
      return {
        ...e,
        name: wallet.user.name,
        email: wallet.user.email,
      };
    });
    return list;
  },
  getAll: async (user) => {
    const { canteen_id, role, id } = user;
    const isAllowed = REQUIRED_ROLE_ADMIN.includes(role);
    if (!isAllowed) throwError(AUTH_ERRORS.INVALID_ROLE);
    let where = {};
    if (role !== "SUPER_ADMIN") {
      where = { user: { canteen_id } };
    }
    const listWallet = await prisma.wallet.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    const totalSummary = await prisma.wallet.aggregate({
      where,
      _sum: {
        balance: true,
      },
      _count: {
        id: true,
      },
    });
    return { listWallet, totalSummary };
  },
  refund: async (user, idWallet) => {},
};

export default walletService;
