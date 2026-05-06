import {
  GETLIST_PERMISSONS,
  UPDATEUSER_PERMISSONS,
  USERDETAIL_PERMISSONS,
} from "../../constant/auth.constant.js";
import { AUTH_ERRORS } from "../../constant/errorMessage.contstant.js";
import prisma from "../../prisma/client.js";
import exclude from "../../utils/exclude.util.js";
import { throwError } from "../../utils/response.util.js";

const userService = {
  getList: async ({ role, canteen_id }) => {
    const isAllowed = GETLIST_PERMISSONS[role];
    if (!isAllowed.includes(role)) {
      throwError(AUTH_ERRORS.INVALID_ROLE);
    }
    const whereCondition = {
      role: { in: isAllowed },
    };
    if (role !== "SUPER_ADMIN") {
      whereCondition.canteen_id = canteen_id;
      whereCondition.status = "ACTIVE";
    }
    const userList = await prisma.user.findMany({
      where: whereCondition,
      include: {
        canteen: {
          select: { name: true },
        },
      },
    });

    return userList.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    );
  },

  getUser: async (paramsId, { role, canteen_id, id }) => {
    if (paramsId === id) {
      const user = await prisma.user.findUnique({ where: { id: paramsId } });
      return exclude(user, ["password"]);
    }
    const isAllowed = USERDETAIL_PERMISSONS[role];
    const whereCondition = {
      id: paramsId,
      role: {
        in: isAllowed,
      },
    };
    if (role !== "SUPER_ADMIN") {
      whereCondition.canteen_id = canteen_id;
    }
    const user = await prisma.user.findFirst({ where: whereCondition });
    if (!user) {
      throwError(AUTH_ERRORS.USER_NOT_FOUND, 404);
    }
    return exclude(user, ["password"]);
  },

  deleteUser: async (paramsId, { role, canteen_id, id, status }) => {
    if (status == "INACTIVE") throwError(AUTH_ERRORS.ACCOUNT_LOCKED);
    const isAllowed = USERDETAIL_PERMISSONS[role];
    const whereCondition = {
      id: paramsId,
      role: {
        in: isAllowed,
      },
    };
    if (role !== "SUPER_ADMIN") {
      whereCondition.canteen_id = canteen_id;
    }
    return await prisma.user.update({
      where: whereCondition,
      data: { status: "INACTIVE" },
    });
  },

  updateUser: async (paramsId, userInfo, updateData) => {
    if (userInfo.status === "INACTIVE")
      throwError(AUTH_ERRORS.ACCOUNT_LOCKED, 403);
  },
};

export default userService;
