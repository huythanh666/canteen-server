import {
  BUSSINESS_PERMISSION,
  STATUS_ORDER,
} from "../../constant/auth.constant.js";
import { AUTH_ERRORS } from "../../constant/errorMessage.contstant.js";
import { allTypes, type } from "../../constant/order.constant.js";
import prisma from "../../prisma/client.js";
import { throwError } from "../../utils/response.util.js";

const orderService = {
  createOrder: async (user, data) => {
    const { canteen_id: userCanteen, role, id } = user;
    let {
      user_id,
      canteen_id,
      user_sub_id,
      voucher_id,
      payment_method,
      sub_total,
      order_items,
    } = data;
    let discount = 0;
    if (userCanteen !== canteen_id) throwError(AUTH_ERRORS.WRONG_CANTEEN);

    return await prisma.$transaction(async (tx) => {
      if (!order_items || order_items.length === 0)
        throwError(AUTH_ERRORS.INVALID_QUANTITY);
      const productIds = order_items.map((item) => item.product_id);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });
      if (products.length !== productIds.length)
        throwError(AUTH_ERRORS.NO_DATA);

      const priceMap = {};
      products.forEach(
        (product) => (priceMap[product.id] = Number(product.price)),
      );

      let serverCalculatedTotal = 0;
      order_items.forEach((item) => {
        if (item.quantity <= 0) throwError(AUTH_ERRORS.INVALID_QUANTITY);
        const price = priceMap[item.product_id];
        if (!price) throwError(AUTH_ERRORS.NO_DATA);
        serverCalculatedTotal += price * item.quantity;
      });
      if (Math.abs(serverCalculatedTotal - sub_total) > 0.001) {
        throwError(AUTH_ERRORS.PRICE_MISMATCH);
      }

      if (voucher_id) {
        const userVoucher = await tx.voucher_user.findFirst({
          where: { id: voucher_id, user: id, status: "AVAILABLE" },
          include: {
            voucher: true,
          },
        });

        if (
          !userVoucher ||
          !userVoucher.voucher ||
          userVoucher.voucher.is_active === 0
        )
          throwError(AUTH_ERRORS.INVALID_VOUCHER);
        const voucherInfo = userVoucher.voucher;

        await tx.voucher.updateMany({
          where: {
            id: userVoucher.voucher_id,
            usage_limit: { gt: 0 },
          },
          data: {
            usage_limit: { decrement: 1 },
          },
        });
        if (voucherInfo.usage_limit <= 0)
          await tx.voucher.update({
            where: { id: userVoucher.voucher_id },
            data: { is_active: 0 },
          });
        throwError(AUTH_ERRORS.INVALID_VOUCHER);

        if (sub_total < voucherInfo.min_order_value)
          throwError(AUTH_ERRORS.INVALID_MIN_ORDER_VALUE);

        if (voucherInfo.discount_type == "PERCENT") {
          discount = (sub_total * voucherInfo.discount_value) / 100;
          if (discount > voucherInfo.max_discount) {
            discount = voucherInfo.max_discount;
          }
        } else {
          discount = voucherInfo.discount_value;
        }
        await tx.voucher_user.update({
          where: { id: userVoucher.id },
          data: { status: "USED", used_at: new Date() },
        });
      }
      if (discount > sub_total) discount = sub_total;

      const finalPrice = sub_total - discount;
      const newOrder = await tx.order.create({
        data: {
          user_id,
          canteen_id,
          user_sub_id: user_sub_id || null,
          voucher_id: voucher_id || null,
          payment_method,
          sub_total,
          discount: discount || 0,
          final_price: finalPrice,
          status: "PENDING",
        },
      });
      const quantityMap = {};
      const orderItemData = order_items.map((e) => {
        quantityMap[e.product_id] = e.quantity;
        return {
          order_id: newOrder.id,
          product_id: e.product_id,
          quantity: e.quantity,
          price_at_purchase: priceMap[e.product_id],
          total_item_price: priceMap[e.product_id] * e.quantity,
        };
      });
      await tx.order_item.createMany({
        data: orderItemData,
      });
      const recipes = await tx.product_recipe.findMany({
        where: {
          product_id: { in: productIds },
          inventory: { canteen_id },
        },
      });
      for (let recipe of recipes) {
        //                     số lượng món ăn khách đặt    *  định lượng công thức
        const totalQuantity = quantityMap[recipe.product_id] * recipe.quantity;

        const updatedInventory = await tx.inventory.updateMany({
          where: {
            id: recipe.material_id,
            quantity: { gte: totalQuantity },
          },
          data: {
            quantity: { decrement: totalQuantity },
          },
        });
        if (updatedInventory.count === 0) throwError(AUTH_ERRORS.OUT_OF_STOCK);

        await tx.inventory_transaction.create({
          data: {
            inventory_id: recipe.material_id,
            order_id: newOrder.id,
            type: "EXPORT",
            quantity: totalQuantity,
            description: `Xuất hàng cho hoá đơn ${newOrder.id}`,
          },
        });
      }
      if (payment_method == "WALLET") {
        const walletUser = await tx.user.findFirst({
          where: { id: user_id, canteen_id },
          include: {
            wallet: {
              select: {
                id: true,
              },
            },
          },
        });
        if (!walletUser) throwError(AUTH_ERRORS.USER_NOT_FOUND);

        const wallet = await tx.wallet.findUnique({
          where: { id: walletUser.wallet.id },
        });
        if (!wallet) throwError(AUTH_ERRORS.WRONG_WALLET);

        const isWallet = await tx.wallet.updateMany({
          where: {
            id: wallet.id,
            balance: { gte: finalPrice },
          },
          data: {
            balance: { decrement: finalPrice },
            total_spending: { increment: finalPrice },
          },
        });
        if (isWallet.count === 0) throwError(AUTH_ERRORS.INVALID_BALANCE);
        const result = await tx.wallet_transaction.create({
          data: {
            wallet_id: wallet.id,
            order_id: newOrder.id,
            amount: finalPrice,
            type: "PAYMENT",
            description: `Thanh toán hoá đơn ${newOrder.id}`,
          },
        });
        return result;
      } else {
        return { description: "Đặt hàng thành công" };
      }
    });
  },

  getHistory: async (user) => {
    const { id, canteen_id } = user;
    return await prisma.order.findMany({
      where: { user_id: id, canteen_id },
    });
  },

  getDetail: async (user, orderId) => {
    const { canteen_id } = user;
    const orderList = await prisma.order_item.findMany({
      where: {
        order_id: orderId,
        order: { canteen_id },
      },
      include: {
        product: {
          select: {
            product_name: true,
          },
        },
      },
    });
    const data = orderList.map(({ product, ...e }) => {
      return {
        ...e,
        product_name: product.product_name,
      };
    });
    return data;
  },
  getAll: async (user) => {
    const { canteen_id } = user;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const orderList = await prisma.order.findMany({
      where: {
        canteen_id,
        status: { in: type },
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        order_item: {
          include: {
            product: {
              select: {
                product_name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const groupStats = await prisma.order.groupBy({
      by: ["status"],
      where: { canteen_id },
      _count: {
        status: true,
      },
    });
    const stats = allTypes.reduce((acc, type) => {
      const found = groupStats.find((g) => g.status === type);
      acc[type] = found ? found._count.status : 0;
      return acc;
    }, {});

    const data = orderList.map((order) => ({
      id: order.id,
      total_price: Number(order.total_price),
      status: order.status,
      payment_method: order.payment_method,
      created_at: order.created_at,
      items: order.order_item.map((item) => ({
        product_name: item.product.product_name,
        quantity: item.quantity,
        price: Number(item.price_at_purchase),
      })),
    }));

    return { orderList: data, statistics: stats };
  },
  updateOrder: async (user, orderId, { status }) => {
    const { canteen_id, id } = user;
    const orderCurrent = await prisma.order.findFirst({
      where: { id: orderId, canteen_id: canteen_id },
    });
    console.log(orderCurrent);
    if (!orderCurrent) throwError(AUTH_ERRORS.INVALID_ORDER);

    const allowedNextStatuses = STATUS_ORDER[orderCurrent.status];
    if (!allowedNextStatuses.includes(status) || !allowedNextStatuses)
      throwError(AUTH_ERRORS.INVALID_STATUS_ORDER);
    const data = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        staff_id: id,
        status,
      },
    });
    return data;
  },
  report: async (user, { start_date, end_date }) => {
    const { canteen_id } = user;

    const start = start_date
      ? new Date(start_date)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = end_date ? new Date(end_date) : new Date();

    const orders = await prisma.order.findMany({
      where: {
        canteen_id,
        status: "COMPLETED",
        created_at: {
          gte: start,
          lte: end,
        },
      },
    });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.final_price),
      0,
    );
    const totalOrders = orders.length;

    return {
      total_revenue: totalRevenue,
      total_orders: totalOrders,
      period: { start, end },
    };
  },
};

export default orderService;
