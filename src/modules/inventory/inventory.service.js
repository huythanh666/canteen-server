import { REQUIRED_ROLE_ADMIN } from "../../constant/auth.constant.js";
import { AUTH_ERRORS } from "../../constant/errorMessage.contstant.js";
import prisma from "../../prisma/client.js";
import { throwError } from "../../utils/response.util.js";

const inventoryService = {
  getAllInventory: async (user) => {
    const { canteen_id } = user;
    const data = await prisma.inventory.findMany({
      where: {
        canteen_id,
      },
      include: {
        product: {
          select: {
            product_name: true,
          },
        },
      },
    });
    const list = data.map(({ product, ...e }) => {
      return {
        ...e,
        product_name: product.product_name,
      };
    });
    return list;
  },
  getAll: async (user) => {
    const { canteen_id } = user;
    const data = await prisma.inventory_transaction.findMany({
      where: {
        inventory: {
          canteen_id,
        },
      },
      include: {
        product: true,
        user: true,
      },
    });
    const list = data.map(({ product, user, ...e }) => {
      return {
        ...e,
        product_name: product.product_name,
        username: user.name,
      };
    });
    return list;
  },
  create: async (user, data) => {
    const { canteen_id, role, id } = user;
    const {
      inventory_id,
      product_id,
      staff_id,
      quantity,
      unit,
      type,
      cost_price,
      description,
      created_at,
    } = data;

    if (staff_id !== id) throwError(AUTH_ERRORS.FAKE_ACCOUNT);
    const isAllowed = REQUIRED_ROLE_ADMIN.includes(role);
    if (!isAllowed) throwError(AUTH_ERRORS.INVALID_ROLE);

    const currentInventory = await prisma.inventory.findUnique({
      where: { id: inventory_id, canteen_id, unit: "kg" },
    });

    if (!currentInventory) throwError(AUTH_ERRORS.NO_DATA);
    let changeAmount = 0;

    if (type === "IMPORT") {
      changeAmount = quantity;
    } else if (type === "WASTE" || type === "EXPORT") {
      if (Number(currentInventory.quantity) < quantity) {
        throwError(AUTH_ERRORS.INVALID_VALUE);
      }
      changeAmount = -quantity;
    } else if (type === "ADJUST") {
      changeAmount = quantity;

      if (Number(currentInventory.quantity) + changeAmount < 0) {
        throwError(AUTH_ERRORS.INVALID_VALUE);
      }
    }

    const newTransaction = await prisma.$transaction(async (tx) => {
      const transaction = await tx.inventory_transaction.create({
        data: {
          inventory_id,
          product_id,
          staff_id,
          quantity,
          unit,
          type,
          cost_price,
          description,
          created_at,
        },
      });

      await tx.inventory.update({
        where: { id: inventory_id },
        data: {
          quantity: { increment: changeAmount },
        },
      });
      return transaction;
    });

    return newTransaction;
  },
  getDetail: async (user, productId) => {
    const { canteen_id, id, role } = user;
    const isAllowed = REQUIRED_ROLE_ADMIN.includes(role);
    if (!isAllowed) throwError(AUTH_ERRORS.INVALID_ROLE);
    const data = await prisma.inventory_transaction.findMany({
      where: { product_id: productId, inventory: { canteen_id } },
      include: {
        product: {
          select: {
            product_name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    const list = data.map(({ product, user, ...e }) => {
      return {
        ...e,
        product_name: product.product_name,
        name: user.name,
      };
    });

    return list;
  },
  getDailyReport: async (user, query) => {
    const { canteen_id, role } = user;
    const isAllowed = REQUIRED_ROLE_ADMIN.includes(role);
    if (!isAllowed) throwError(AUTH_ERRORS.INVALID_ROLE);

    const { start_date, end_date } = query;
    const start = start_date ? new Date(start_date) : new Date("2026-04-01");
    const end = end_date ? new Date(end_date) : new Date();
    const report = await prisma.inventory_transaction.groupBy({
      by: ["type"],
      where: {
        inventory: { canteen_id },
        created_at: {
          gte: start,
          lte: end,
        },
      },
      _sum: { quantity: true },
    });
    return report;
  },
};
export default inventoryService;
