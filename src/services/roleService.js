const Role = require("../models/Role");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

// Tạo role mới (admin)
const createRole = async (body) => {
  const existing = await Role.findOne({ name: body.name });
  if (existing) throw new ApiError(httpStatus.BAD_REQUEST, "Role already exists");
  const role = await Role.create(body);
  return role;
};

// Lấy danh sách role (public)
const getRoles = async (filter = {}, options = {}) => {
  return Role.paginate(filter, options);
};

// Lấy role theo id (public)
const getRoleById = async (id) => {
  const role = await Role.findById(id);
  if (!role) throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  return role;
};

// Sửa role (admin)
const updateRoleById = async (roleId, updateBody) => {
  const role = await getRoleById(roleId);
  Object.assign(role, updateBody);
  await role.save();
  return role;
};

// Xóa role (admin)
const deleteRoleById = async (roleId) => {
  const role = await getRoleById(roleId);
  await role.delete();
  return role;
};

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
};
