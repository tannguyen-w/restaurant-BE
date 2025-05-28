const tableService = require("../services/tableService");

// Tạo mới Table
const createTable = async (req, res, next) => {
  try {
    const table = await tableService.createTable(req.body);
    res.status(201).json(table);
  } catch (err) {
    next(err);
  }
};

// Lấy danh sách Table
const getTables = async (req, res, next) => {
  try {
    const { page, limit, ...filter } = req.query;
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    };
    const result = await tableService.getTables(filter, options);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Lấy chi tiết Table
const getTable = async (req, res, next) => {
  try {
    const table = await tableService.getTableById(req.params.id);
    res.json(table);
  } catch (err) {
    next(err);
  }
};

// Cập nhật Table
const updateTable = async (req, res, next) => {
  try {
    const table = await tableService.updateTableById(req.params.id, req.body);
    res.json(table);
  } catch (err) {
    next(err);
  }
};

// Xóa Table (soft delete)
const deleteTable = async (req, res, next) => {
  try {
    await tableService.deleteTableById(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// Lấy danh sách table theo nhà hàng
const getTablesByRestaurant = async (req, res, next) => {
  try {
    const tables = await tableService.getTablesByRestaurant(req.params.restaurantId);
    res.json(tables);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTable,
  getTables,
  getTable,
  updateTable,
  deleteTable,
  getTablesByRestaurant,
};
