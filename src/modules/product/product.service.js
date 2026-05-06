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

  create: async (user, data, file) => {
    const { role } = user;
    if (role !== "SUPER_ADMIN") throwError(AUTH_ERRORS.INVALID_ROLE);
    if (!data) throwError({ message: "Dữ liệu sản phẩm không hợp lệ" });
    const imageUrl = file ? file.path : null;
    const productData = {
      product_name: data.product_name,
      category: data.category,
      unit: data.unit,
      price: Number(data.price || 0),
      protein: Number(data.protein || 0),
      fat: Number(data.fat || 0),
      calo: Number(data.calo || 0),
      image: imageUrl,
      is_subscription: false,
      is_selling: true,
      is_available: true,
    };

    const product = await prisma.product.create({
      data: productData,
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

      return result;
    });
  },

  updateById: async (user, productId) => {
    const { role, canteen_id } = user;
    if (role !== "SUPER_ADMIN") throwError(AUTH_ERRORS.INVALID_ROLE);
    const isProduct = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });
    if (!isProduct) throwError(AUTH_ERRORS.NO_DATA);
    const isRecipe = await prisma.product_recipe.findMany({
      where: { product_id: productId },
    });
    if (isRecipe.length === 0) throwError(AUTH_ERRORS.INVALID_RECIPE);
    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        is_available: true,
        is_selling: true,
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
