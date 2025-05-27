const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const DEFAULT_AVATAR = "../public/images/avatars/default.webp";

// Đăng ký/khởi tạo user với role customer (dành cho user tự đăng ký)
const register = async ({ username, password }) => {
  // Kiểm tra username đã tồn tại
  const existing = await User.findOne({ username });
  if (existing) throw new ApiError(httpStatus.BAD_REQUEST, "Username already exists");
  const userData = { username, password, role: "customer" };
  userData.avatar = DEFAULT_AVATAR;
  // Tạo user mới với role customer
  const user = await User.create(userData);
  return user;
};

// Admin thêm user (phân role và restaurant)
const createUser = async (body) => {
  const existing = await User.findOne({ username: body.username });
  if (existing) throw new ApiError(httpStatus.BAD_REQUEST, "Username already exists");
  if (body.role === "staff" && !body.restaurant) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Staff must have a restaurant");
  }
  const userData = { ...body };
  if (!userData.avatar) userData.avatar = DEFAULT_AVATAR;
  const user = await User.create(userData);
  return user;
};

const getUsers = async (filter = {}, options = {}) => {
  return User.paginate(filter, options);
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  return user;
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  // Không cho phép sửa username
  delete updateBody.username;
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  await user.delete();
  return user;
};

// Cập nhật thông tin cá nhân (ai cũng sửa được của mình)
const updateProfile = async (userId, updateBody) => {
  delete updateBody.role;
  delete updateBody.username;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

// Đổi mật khẩu (yêu cầu oldPassword)
const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) throw new ApiError(httpStatus.BAD_REQUEST, "Old password incorrect");
  user.password = newPassword;
  await user.save();
};

// Quên mật khẩu: gửi token reset
const forgotPassword = async (username) => {
  const user = await User.findOne({ username });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  await user.save();
  return token;
};

// Đặt lại mật khẩu qua token
const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "Token invalid or expired");
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};

module.exports = {
  register,
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};
