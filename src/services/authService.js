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
  const user = await User.findOne({ username });
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

/**
 * Validate email
 */
function isEmail(email) {
  // Regex email chuẩn đơn giản
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Đăng ký user mới
 */
exports.register = async ({ username, password, role }) => {
  // Kiểm tra username là email hợp lệ
  if (!isEmail(username)) throw new Error("Username must be a valid email address");

  // Kiểm tra username đã tồn tại
  const existing = await User.findOne({ username });
  if (existing) throw new Error("Username already exists");
  // Tạo user mới
  const user = await User.create({ username, password, role });
  return {
    _id: user._id,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
  };
};
