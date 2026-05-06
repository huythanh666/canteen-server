import { REQUIRED_ROLE_ADMIN } from "../../constant/auth.constant.js";
import { AUTH_ERRORS } from "../../constant/errorMessage.contstant.js";
import prisma from "../../prisma/client.js";
import { throwError } from "../../utils/response.util.js";

const inventoryService = {
  getAllInventory: async (user, query) => {
    const { canteen_id: userCanteenId, role } = user;
    const { canteenId: targetCanteenId } = query;
    const where = {};
    if (role === "SUPER_ADMIN") {
      if (targetCanteenId) {
        where.canteen_id = targetCanteenId;
      }
    } else {
      where.canteen_id = userCanteenId;
    }
    const inventoryList = await prisma.inventory.findMany({
      where,
      include: {
        canteen: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        canteen_id: "asc",
      },
    });
    const data = inventoryList.map(({ canteen, ...e }) => {
      return {
        ...e,
        canteen_name: canteen.name,
      };
    });

    return data;
  },
  getAllTransaction: async (user) => {
    const { canteen_id, role } = user;
    let whereCondition = {};
    if (role !== "SUPER_ADMIN") {
      whereCondition = {
        inventory: {
          canteen_id,
        },
      };
    }
    const listInventoryTransaction =
      await prisma.inventory_transaction.findMany({
        where: whereCondition,
        include: {
          inventory: {
            select: { inventory_name: true, unit: true, canteen: true },
          },
          staff: { select: { name: true } },
          order: { select: { id: true } },
        },
        orderBy: {
          created_at: "desc",
        },
      });
    const data = listInventoryTransaction.map(({ inventory, staff, ...e }) => {
      return {
        ...e,
        inventory_name: inventory.inventory_name,
        canteen_name: inventory.canteen.name,
        staff_name: staff.name,
      };
    });
    return data;
  },
  createInventory: async (user, data) => {
    const { canteen_id: staffCanteenId, role, id } = user;
    const { inventory_name, canteen_id, quantity, min_stock, cost_price } =
      data;

    const isAllowed = REQUIRED_ROLE_ADMIN.includes(role);
    if (!isAllowed) throwError(AUTH_ERRORS.INVALID_ROLE);

    if (staffCanteenId !== canteen_id) throwError(AUTH_ERRORS.INVALID_ROLE);

    return await prisma.inventory.create({
      data: { inventory_name, canteen_id, quantity, min_stock, cost_price },
    });
  },
  createTransactionInventory: async (user, data) => {
    const { canteen_id, role, id } = user;
    const { inventory_id, order_id, staff_id, type, quantity, description } =
      data;
    if (type !== "EXPORT") {
      data.order_id = null;
    }
    if (staff_id !== id) throwError(AUTH_ERRORS.FAKE_ACCOUNT);
    const isAllowed = REQUIRED_ROLE_ADMIN.includes(role);
    if (!isAllowed) throwError(AUTH_ERRORS.INVALID_ROLE);
    const whereCondition = { id: inventory_id };
    if (role !== "SUPER_ADMIN") {
      whereCondition.canteen_id = canteen_id;
    }
    const currentInventory = await prisma.inventory.findFirst({
      where: whereCondition,
    });

    if (!currentInventory) throwError(AUTH_ERRORS.NO_DATA);
    let changeAmount = 0;
    const currentQty = Number(currentInventory.quantity);

    switch (type) {
      case "IMPORT":
        changeAmount = quantity;
        break;
      case "WASTE":
      case "EXPORT":
        if (currentQty < quantity) throwError(AUTH_ERRORS.INVALID_VALUE);
        changeAmount = -quantity;
        break;
      case "ADJUST":
        changeAmount = quantity;
        if (currentQty + changeAmount < 0)
          throwError(AUTH_ERRORS.INVALID_VALUE);
        break;
      default:
        throwError(AUTH_ERRORS.INVALID_VALUE);
    }

    return await prisma.$transaction(async (tx) => {
      const transactionRecord = await tx.inventory_transaction.create({
        data: {
          inventory_id,
          order_id,
          staff_id,
          type,
          quantity,
          description,
        },
      });
      await tx.inventory.update({
        where: { id: inventory_id },
        data: {
          quantity: { increment: changeAmount },
        },
      });

      return transactionRecord;
    });
  },
  getDetail: async (user, inventoryId) => {
    const { role } = user;
    if (!REQUIRED_ROLE_ADMIN.includes(role))
      throwError(AUTH_ERRORS.INVALID_ROLE);
    const data = await prisma.inventory_transaction.findMany({
      where: { inventory_id: inventoryId },
      include: {
        inventory: {
          select: {
            inventory_name: true,
            unit: true,
            canteen: { select: { name: true } },
          },
        },
        staff: { select: { name: true } },
      },
      orderBy: { created_at: "desc" },
    });

    return data.map(({ inventory, staff, ...e }) => ({
      ...e,
      inventory_name: inventory.inventory_name,
      unit: inventory.unit,
      canteen_name: inventory.canteen.name,
      staff_name: staff?.name || "Hệ thống",
    }));
  },
  getDailyReport: async (user, query) => {
    const { canteen_id, role } = user;
    if (!REQUIRED_ROLE_ADMIN.includes(role))
      throwError(AUTH_ERRORS.INVALID_ROLE);

    const { start_date, end_date } = query;
    const start = start_date ? new Date(start_date) : new Date("2026-04-01");
    const end = end_date ? new Date(end_date) : new Date();

    const whereCondition = {
      created_at: { gte: start, lte: end },
    };

    if (role !== "SUPER_ADMIN") {
      whereCondition.inventory = {
        canteen_id: canteen_id,
      };
    }

    const report = await prisma.inventory_transaction.groupBy({
      by: ["type"],
      where: whereCondition,
      _sum: { quantity: true },
      _count: { id: true },
    });

    return report;
  },
  report: async (user) => {
    const { canteen_id, role } = user;
    let whereCondition = {};
    if (role !== "SUPER_ADMIN") {
      whereCondition = { canteen_id };
    }
    const inventoryList = await prisma.inventory.findMany({
      where: whereCondition,
    });
    const stats = inventoryList.reduce(
      (acc, item) => {
        const quantity = Number(item.quantity) || 0;
        const costPrice = Number(item.cost_price) || 0;

        acc.total_quantity += quantity;
        acc.total_value += quantity * costPrice;

        return acc;
      },
      { total_quantity: 0, total_value: 0 },
    );
    return stats;
  },
};
export default inventoryService;
