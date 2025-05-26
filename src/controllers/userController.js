const userService = require("../services/userService");

// Đăng ký cho người dùng thông thường (role luôn là customer)
const register = async (req, res, next) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// Admin tạo user (có quyền gán role)
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body, req.user);
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
    const result = await userService.queryUsers(filter, options);
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
    const user = await userService.updateUserById(req.params.id, req.body, req.user);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUserById(req.params.id);
    res.status(204).send();
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
};
