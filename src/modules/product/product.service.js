import { REQUIRED_ROLE_ADMIN } from "../../constant/auth.constant.js";
import { AUTH_ERRORS } from "../../constant/errorMessage.contstant.js";
import { unit } from "../../constant/product.constants.js";
import prisma from "../../prisma/client.js";
import { throwError } from "../../utils/response.util.js";

const productService = {
  getAll: async (user) => {
    const { canteen_id } = user;
    const data = await prisma.inventory.findMany({
      where: {
        canteen_id,
        unit,
        product: {
          is_available: true,
        },
      },
      include: {
        product: true,
      },
    });
    const listFood = data.map((e) => e.product);
    return listFood;
  },

  getById: async (user, productId) => {
    const { canteen_id } = user;
    const isProduct = await prisma.product_recipe.findFirst({
      where: { product_id: productId },
    });
    if (!isProduct) throwError(AUTH_ERRORS.DETAIL_PRODUCT);
    const detail = await prisma.product_recipe.findMany({
      where: {
        product_id: productId,
      },
      include: {
        material: {
          select: {
            product_name: true,
            fat: true,
            calo: true,
            protein: true,
            inventory: { where: { canteen_id } },
          },
        },
      },
    });
    const materials = detail.map((e) => {
      return {
        material_name: e.material.product_name,
        quantity: e.quantity,
        unit: e.unit,
        fat: e.material.fat,
        calo: e.material.calo,
        protein: e.material.protein,
      };
    });
    return materials;
  },

  create: async (user, data) => {
    const { canteen_id, role } = user;
    const isAllowed = REQUIRED_ROLE_ADMIN.includes(role);
    if (!isAllowed) throwError(AUTH_ERRORS.INVALID_ROLE);
    const {
      product_name,
      category,
      price,
      unit,
      protein,
      fat,
      calo,
      is_subscription,
    } = data;
    const newProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          product_name,
          category,
          price: price || 0,
          unit: unit || "kg",
          protein: protein || 0,
          fat: fat || 0,
          calo: calo || 0,
          is_subscription: is_subscription ?? true,
          is_selling: true,
          is_available: true,
        },
      });
      await tx.inventory.create({
        data: {
          product_id: product.id,
          canteen_id: canteen_id,
          quantity: category == "MATERIAL" ? 0 : 1,
          unit: product.unit,
          min_stock: 0,
        },
      });
      return product;
    });

    return newProduct;
  },

  updateById: async (user, productId, data) => {
    const { role, canteen_id } = user;

    const isAllowed = REQUIRED_ROLE_ADMIN.includes(role);
    if (!isAllowed) throwError(AUTH_ERRORS.INVALID_ROLE);

    const checkOwnership = await prisma.inventory.findFirst({
      where: {
        product_id: productId,
        canteen_id,
      },
    });

    if (!checkOwnership && role !== "SUPER_ADMIN") {
      throwError(AUTH_ERRORS.INVALID_ROLE);
    }

    const {
      product_name,
      category,
      price,
      unit,
      protein,
      fat,
      calo,
      is_subscription,
      is_selling,
      is_available,
    } = data;

    const updatedProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id: productId },
        data: {
          product_name,
          category,
          price,
          unit,
          protein,
          fat,
          calo,
          is_subscription,
          is_selling,
          is_available,
        },
      });

      await tx.inventory.updateMany({
        where: {
          product_id: productId,
          canteen_id,
        },
        data: {
          unit,
        },
      });

      return product;
    });

    return updatedProduct;
  },

  deleteById: async (user, productId) => {
    const { role, canteen_id } = user;

    const isAllowed = REQUIRED_ROLE_ADMIN.includes(role);
    if (!isAllowed) throwError(AUTH_ERRORS.INVALID_ROLE);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throwError(AUTH_ERRORS.NO_DATA);

    const checkOwnership = await prisma.inventory.findFirst({
      where: {
        product_id: productId,
        canteen_id,
      },
    });

    if (!checkOwnership && role !== "SUPER_ADMIN") {
      throwError(AUTH_ERRORS.INVALID_ROLE);
    }

    return await prisma.product.update({
      where: { id: productId },
      data: {
        is_available: false,
        is_selling: false,
      },
    });
  },
};

export default productService;
