const Supplier = require("../models/Supplier");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

// Tạo mới Supplier
const createSupplier = async (data) => {
  const exist = await Supplier.findOne({ name: data.name });
  if (exist) throw new ApiError(httpStatus.BAD_REQUEST, "Supplier name already exists");
  return Supplier.create(data);
};

// Lấy danh sách Supplier (có phân trang)
const getSuppliers = async (filter = {}, options = {}) => {
  return Supplier.paginate ? Supplier.paginate(filter, options) : Supplier.find(filter);
};

// Lấy chi tiết 1 Supplier
const getSupplierById = async (id) => {
  const supplier = await Supplier.findById(id);
  if (!supplier) throw new ApiError(httpStatus.NOT_FOUND, "Supplier not found");
  return supplier;
};

// Cập nhật Supplier
const updateSupplierById = async (id, updateData) => {
  const supplier = await getSupplierById(id);
  Object.assign(supplier, updateData);
  await supplier.save();
  return supplier;
};

// Xóa Supplier
const deleteSupplierById = async (id) => {
  const supplier = await getSupplierById(id);
  await supplier.deleteOne();
  return supplier;
};

module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplierById,
  deleteSupplierById,
};
