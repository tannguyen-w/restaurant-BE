const userService = require("../services/userService");
const fileService = require("../services/fileService");
const Role = require("../models/Role");

// Đăng ký cho người dùng thông thường (role luôn là customer)
const register = async (req, res, next) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// Admin thêm user (phân role và restaurant)
const createUser = async (req, res, next) => {
  try {
    let avatarUrl;

    if (req.file) {
      avatarUrl = await fileService.saveSingle(req.file, "avatar");
    }

    const user = await userService.createUser({
      ...req.body,
      avatar: avatarUrl,
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    // req.user được middleware auth gán (id hoặc object user)
    // Nếu chỉ là id, lấy user từ DB
    const userId = req.user._id || req.user.id || req.user;
    const user = await userService.getMe(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { page, limit, ...filter } = req.query;
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    };
    const result = await userService.getUsers(filter, options);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    let avatarUrl;
    if (req.file) {
      avatarUrl = await fileService.saveSingle(req.file, "avatar");
    }
    const updateData = { ...req.body };
    if (avatarUrl) updateData.avatar = avatarUrl;
    const user = await userService.updateUserById(req.params.id, updateData);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    let userId = req.params.id;
    if (userId === "me") userId = req.user._id;
    await userService.deleteUserById(userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const customers = await userService.getCustomers();
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

const getStaffs = async (req, res, next) => {
  try {
    const staffs = await userService.getStaffs();
    res.json(staffs);
  } catch (error) {
    next(error);
  }
};

// Cập nhật thông tin cá nhân (ai cũng sửa được của mình)
const updateProfile = async (req, res, next) => {
  try {
    let avatarUrl;
    if (req.file) {
      avatarUrl = await fileService.saveSingle(req.file, "avatar");
    }
    const updateData = { ...req.body };
    if (avatarUrl) updateData.avatar = avatarUrl;
    const user = await userService.updateProfile(req.user._id, updateData);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Đổi mật khẩu
const changePassword = async (req, res, next) => {
  try {
    await userService.changePassword(req.user._id, req.body.oldPassword, req.body.newPassword);
    res.json({ message: "Password changed successfully!" });
  } catch (err) {
    next(err);
  }
};

// Quên mật khẩu
const forgotPassword = async (req, res, next) => {
  try {
    const token = await userService.forgotPassword(req.body.username);
    // Thực tế nên gửi token qua email, demo trả về luôn
    res.json({ message: "Check your email for the reset link", token });
  } catch (err) {
    next(err);
  }
};

// Đặt lại mật khẩu
const resetPassword = async (req, res, next) => {
  try {
    await userService.resetPassword(req.body.token, req.body.newPassword);
    res.json({ message: "Password reset successfully!" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  getCustomers,
  getMe,
  getStaffs,
};
