import { REQUIRED_ROLE_ADMIN } from "../../constant/auth.constant.js";
import { AUTH_ERRORS } from "../../constant/errorMessage.contstant.js";
import { unit } from "../../constant/product.constants.js";
import prisma from "../../prisma/client.js";
import { throwError } from "../../utils/response.util.js";

const productService = {
  getAll: async (user) => {
    const { canteen_id } = user;
    const data = await prisma.product.findMany({
      orderBy: { product_name: "asc" },
      include: {
        product_reviews: {
          select: {
            rating: true,
          },
        },
      },
    });
    return data.map((product) => {
      const totalReviews = product.product_reviews.length;
      const avgRating =
        totalReviews > 0
          ? product.product_reviews.reduce((sum, r) => sum + r.rating, 0) /
            totalReviews
          : 5;

      return {
        ...product,
        avgRating: Number(avgRating.toFixed(1)),
        totalReviews,
        product_reviews: undefined,
      };
    });
  },

  getById: async (user, productId) => {
    const { canteen_id } = user;
    const data = await prisma.product_recipe.findMany({
      where: { product_id: productId, inventory: { canteen_id } },
      include: {
        inventory: {
          select: {
            inventory_name: true,
            unit: true,
          },
        },
      },
    });
    const review = await prisma.product_review.findMany({
      where: {
        product_id: productId,
      },
      select: {
        comment: true,
        image: true,
        rating: true,
      },
    });
    const listMaterial = data.map(({ inventory, ...e }) => {
      return {
        ...e,
        materials_name: inventory.inventory_name,
      };
    });
    return { listMaterial, review };
  },

  create: async (user, data) => {
    const { canteen_id, role } = user;
    if (role !== "SUPER_ADMIN") throwError(AUTH_ERRORS.INVALID_ROLE);
    const { product_name, category, price, unit, protein, fat, calo } = data;
    const product = await prisma.product.create({
      data: {
        product_name,
        category,
        price,
        unit,
        protein,
        fat,
        calo,
      },
    });
    return product;
  },

  createRecipe: async (user, data) => {
    const { role, canteen_id } = user;
    const { product_id, recipes } = data;
    if (role !== "SUPER_ADMIN") throwError(AUTH_ERRORS.INVALID_ROLE);

    return await prisma.$transaction(async (tx) => {
      const recipeData = recipes.map((e) => ({
        product_id,
        material_id: e.material_id,
        quantity: parseFloat(e.quantity),
        unit: e.unit,
      }));
      const materialIds = recipeData.map((r) => r.material_id);
      const existingMaterials = await tx.inventory.findMany({
        where: {
          id: { in: materialIds },
        },
        select: { id: true },
      });
      if (existingMaterials.length !== materialIds.length) {
        throwError(AUTH_ERRORS.NO_DATA);
      }
      const result = await tx.product_recipe.createMany({
        data: recipeData,
      });
      await tx.product.update({
        where: { id: product_id },
        data: { is_selling: true, is_available: true },
      });
      return result;
    });
  },

  updateById: async (user, productId, data) => {
    const { role, canteen_id } = user;
    if (role !== "SUPER_ADMIN") throwError(AUTH_ERRORS.INVALID_ROLE);
    const isProduct = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });
    if (!isProduct) throwError(AUTH_ERRORS.NO_DATA);
    const {
      product_name,
      price,
      unit,
      protein,
      fat,
      calo,
      is_subscription,
      is_selling,
      is_available,
    } = data;
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        product_name,
        price,
        unit,
        protein,
        fat,
        calo,
        is_selling,
        is_available,
        is_subscription,
      },
    });
    return product;
  },

  deleteById: async (user, productId) => {
    const { role, canteen_id } = user;
    if (role !== "SUPER_ADMIN") throwError(AUTH_ERRORS.INVALID_ROLE);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throwError(AUTH_ERRORS.NO_DATA);

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
