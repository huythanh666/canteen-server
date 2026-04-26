import { AUTH_ERRORS } from "../../constant/errorMessage.contstant.js";
import prisma from "../../prisma/client.js";
import { throwError } from "../../utils/response.util.js";

const productReviewService = {
  createReview: async (data, user, productId, file) => {
    const { id } = user;
    const { order_id, product_id, comment, rating } = data;
    const imageUrl = file ? file.path : null;
    const orderStatus = await prisma.order.findFirst({
      where: {
        id: order_id,
        user_id: id,
      },
    });
    if (!orderStatus || orderStatus.status !== "COMPLETED")
      throwError(AUTH_ERRORS.INVALID_STATUS_ORDER);

    const isProduct = await prisma.product.findUnique({
      where: { id: product_id },
    });
    if (!isProduct) throwError(AUTH_ERRORS.NO_DATA);

    const existingReview = await prisma.product_review.findFirst({
      where: {
        order_id: order_id,
        product_id: product_id,
        user_id: id,
      },
    });
    if (existingReview) {
      throwError(AUTH_ERRORS.REVIEW_ALREADY_EXISTS);
    }

    return await prisma.product_review.create({
      data: {
        user_id: id,
        order_id: order_id,
        product_id: product_id,
        comment: comment,
        rating: Number(rating),
        image: imageUrl,
      },
    });
  },
  getAllReview: async (productId) => {
    const listReview = await prisma.product_review.findMany({
      where: {
        product_id: productId,
      },
      include: {
        product: { select: { product_name: true } },
      },
      orderBy: { created_at: "asc" },
    });
    return listReview;
  },
};
export default productReviewService;
