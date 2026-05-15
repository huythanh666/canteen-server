import {
  BUSSINESS_PERMISSION,
  REQUIRED_ROLE_ADMIN,
} from "../../constant/auth.constant.js";
import { AUTH_ERRORS } from "../../constant/errorMessage.contstant.js";
import prisma from "../../prisma/client.js";
import { throwError } from "../../utils/response.util.js";

const walletService = {
  getDetail: async (user) => {
    const { canteen_id, id } = user;
    const detail = await prisma.wallet.findFirst({
      where: { user: { canteen_id, id } },
      include: { wallet_transaction: { orderBy: { created_at: "desc" } } },
    });
    if (!detail) throwError(AUTH_ERRORS.USER_NOT_FOUND);
    return detail;
  },
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
      orderBy: { created_at: "desc" },
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
  report: async (user) => {
    const { canteen_id, role } = user;
    let whereCondition = {};
    if (role !== "SUPER_ADMIN") {
      whereCondition = { canteen_id };
    }

    const walletList = await prisma.wallet.findMany({
      where: whereCondition,
    });

    const stats = walletList.reduce(
      (acc, item) => {
        const balance = Number(item.balance) || 0;
        const totalSpending = Number(item.total_spending) || 0;
        acc.total_balance += balance;
        acc.total_spending += totalSpending;
        acc.total_wallet += 1;
        return acc;
      },
      { total_balance: 0, total_spending: 0, total_wallet: 0 },
    );

    return stats;
  },
  refund: async (user, idWallet) => {},
};

export default walletService;
