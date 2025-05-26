const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

// Đăng ký/khởi tạo user với role customer (dành cho user tự đăng ký)
const register = async ({ username, password }) => {
  // Kiểm tra username đã tồn tại
  const existing = await User.findOne({ username });
  if (existing) throw new ApiError(httpStatus.BAD_REQUEST, "Username already exists");
  // Tạo user mới với role customer
  const user = await User.create({ username, password, role: "customer" });
  return {
    _id: user._id,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
  };
};

// Admin tạo user, có quyền gán role bất kỳ
const createUser = async (body, currentUser) => {
  // Nếu không phải admin, luôn gán role là customer
  let role = "customer";
  if (currentUser && currentUser.role === "admin" && body.role) {
    role = body.role;
  }
  // Kiểm tra username đã tồn tại
  const existing = await User.findOne({ username: body.username });
  if (existing) throw new ApiError(httpStatus.BAD_REQUEST, "Username already exists");
  // Tạo user mới
  const user = await User.create({ ...body, role });
  return user;
};

const queryUsers = async (filter, options) => {
  return User.paginate(filter, options);
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  return user;
};

const updateUserById = async (userId, updateBody, currentUser) => {
  const user = await getUserById(userId);
  // Nếu không phải admin, không được phép sửa role
  if ((!currentUser || currentUser.role !== "admin") && updateBody.role) {
    delete updateBody.role;
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  await user.delete();
  return user;
};

module.exports = {
  register,
  createUser,
  queryUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
