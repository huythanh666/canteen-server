import asyncHandler from "../../utils/asyncHandler.util.js";
import prisma from "../../prisma/client.js";
import { comparePassword, hashPassword } from "../../utils/password.util.js";
import { throwError } from "../../utils/response.util.js";
import { generateTokenJWT } from "../../utils/jwt.util.js";
import exclude from "../../utils/exclude.util.js";
import { AUTH_ERRORS } from "../../constant/errorMessage.contstant.js";
import { SIGNUP_PERMISSIONS } from "../../constant/auth.constant.js";

const createAuthResponse = (user) => {
  const userWithoutPassword = exclude(user, ["password"]);
  const payloadToken = {
    id: user.id,
    role: user.role,
    status: user.status,
    campus_id: user.campus_id,
    canteen_id: user.canteen_id,
  };
  const { accessToken, refreshToken } = generateTokenJWT(payloadToken);
  return { user: userWithoutPassword, accessToken, refreshToken };
};

const authService = {
  signup: async (payload, access) => {
    const {
      email,
      password,
      birthday,
      campus_id,
      canteen_id,
      name,
      role,
      email_parents,
    } = payload;
    const isAllowed = SIGNUP_PERMISSIONS[access];
    if (!isAllowed.includes(role)) throwError(AUTH_ERRORS.INVALID_ROLE);
    const isEmail = await prisma.user.findUnique({ where: { email } });
    if (isEmail) {
      throwError(AUTH_ERRORS.EMAIL_ALREADY_EXISTS);
    }
    const hash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        birthday: new Date(birthday),
        password: hash,
        campus_id,
        canteen_id,
        role,
        email_parents,
      },
    });
    return createAuthResponse(user);
  },

  signin: async (payload) => {
    const { email, password } = payload;
    const userData = await prisma.user.findUnique({
      where: { email, status: "ACTIVE" },
    });
    if (!userData) {
      throwError(AUTH_ERRORS.USER_NOT_FOUND);
    }
    const isPassword = await comparePassword(password, userData.password);
    if (!isPassword) {
      throwError(AUTH_ERRORS.INVALID_CREDENTIALS);
    }
    return createAuthResponse(userData);
  },
};

export default authService;
