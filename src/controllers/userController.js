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

    let roleId = req.body.role;
    if (roleId && !roleId.match(/^[0-9a-fA-F]{24}$/)) {
      const roleDoc = await Role.findOne({ name: roleId });
      if (!roleDoc) {
        return res.status(400).json({ message: "Role không hợp lệ" });
      }
      roleId = roleDoc._id;
    }

    const user = await userService.createUser({
      ...req.body,
      role: roleId,
      avatar: avatarUrl,
    });

    res.status(201).json(user);
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
};
