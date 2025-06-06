const User = require("../models/User");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const createAccessToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE_IN }
  );

const createRefreshToken = (user) =>
  jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE_IN }
  );

/**
 * Đăng nhập
 */
exports.login = async ({ username, password }) => {
  const user = await User.findOne({ username }).populate("role");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Sai tên đăng nhập hoặc mật khẩu");
  }

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      username: user.username,
      role: user.role,
    },
  };
};

/**
 * Đăng xuất
 */
exports.logout = async () => {
  return { message: "Logout successful" };
};
