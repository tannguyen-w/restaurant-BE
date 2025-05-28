const supplierService = require("../services/supplierService");

// Tạo mới
const createSupplier = async (req, res, next) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);
    res.status(201).json(supplier);
  } catch (err) {
    next(err);
  }
};

// Lấy danh sách
const getSuppliers = async (req, res, next) => {
  try {
    const { page, limit, ...filter } = req.query;
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    };
    const result = await supplierService.getSuppliers(filter, options);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Lấy chi tiết
const getSupplier = async (req, res, next) => {
  try {
    const supplier = await supplierService.getSupplierById(req.params.id);
    res.json(supplier);
  } catch (err) {
    next(err);
  }
};

// Cập nhật
const updateSupplier = async (req, res, next) => {
  try {
    const supplier = await supplierService.updateSupplierById(req.params.id, req.body);
    res.json(supplier);
  } catch (err) {
    next(err);
  }
};

// Xóa
const deleteSupplier = async (req, res, next) => {
  try {
    await supplierService.deleteSupplierById(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
};
