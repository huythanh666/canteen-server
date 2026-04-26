import { AUTH_ERRORS } from "../../constant/errorMessage.contstant.js";
import prisma from "../../prisma/client.js";
import { throwError } from "../../utils/response.util.js";

const reviewCommentService = {
  createComment: async (data, user, file) => {
    const { id } = user;
    const { food_review_id, description } = data;
    const imageUrl = file ? file.path : null;
    const review = await prisma.product_review.findFirst({
      where: {
        id: food_review_id,
      },
    });
    if (!review) throwError(AUTH_ERRORS.INVALID_REVIEW);

    return await prisma.product_review_comment.create({
      data: {
        user_id: id,
        food_review_id,
        image: imageUrl,
        description,
      },
    });
  },
  getAllComment: async (reviewId) => {
    return await prisma.product_review_comment.findMany({
      where: {
        food_review_id: reviewId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { created_at: "asc" },
    });
  },
};

export default reviewCommentService;
