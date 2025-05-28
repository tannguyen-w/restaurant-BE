const Table = require("../models/Table");
const Restaurant = require("../models/Restaurant");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

// Tạo mới Table
const createTable = async (data) => {
  const restaurantId = await Restaurant.findOne({ name: data.restaurant });
  data.restaurant = restaurantId._id;
  const exist = await Table.findOne({ name: data.name, restaurant: data.restaurant });
  if (exist) throw new ApiError(httpStatus.BAD_REQUEST, "Table name already exists in this restaurant");
  return Table.create(data);
};

// Lấy danh sách Table (hỗ trợ filter, phân trang)
const getTables = async (filter = {}, options = {}) => {
  return Table.paginate ? Table.paginate(filter, options) : Table.find(filter);
};

// Lấy chi tiết một Table
const getTableById = async (id) => {
  const table = await Table.findById(id);
  if (!table) throw new ApiError(httpStatus.NOT_FOUND, "Table not found");
  return table;
};

// Cập nhật Table
const updateTableById = async (id, updateData) => {
  const table = await getTableById(id);
  Object.assign(table, updateData);
  await table.save();
  return table;
};

// Xóa Table (soft delete)
const deleteTableById = async (id) => {
  const table = await getTableById(id);
  await table.delete();
  return table;
};

// Lấy danh sách table theo restaurantId
const getTablesByRestaurant = async (restaurantId) => {
  return Table.find({ restaurant: restaurantId });
};

module.exports = {
  createTable,
  getTables,
  getTableById,
  updateTableById,
  deleteTableById,
  getTablesByRestaurant,
};
