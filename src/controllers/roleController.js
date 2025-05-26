const roleService = require("../services/roleService");

const createRole = async (req, res, next) => {
  try {
    const role = await roleService.createRole(req.body);
    res.status(201).json(role);
  } catch (err) {
    next(err);
  }
};

// Danh sách role (public)
const getRoles = async (req, res, next) => {
  try {
    const { page, limit, ...filter } = req.query;
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    };
    const result = await roleService.getRoles(filter, options);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Xem chi tiết 1 role (public)
const getRole = async (req, res, next) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    res.json(role);
  } catch (err) {
    next(err);
  }
};

// Sửa role (admin)
const updateRole = async (req, res, next) => {
  try {
    const role = await roleService.updateRoleById(req.params.id, req.body);
    res.json(role);
  } catch (err) {
    next(err);
  }
};

// Xóa role (admin)
const deleteRole = async (req, res, next) => {
  try {
    await roleService.deleteRoleById(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
};
