const Order = require("../models/Order");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

/**
 * Tạo mới order
 * data: { customer, table, status, orderTime }
 */
const createOrder = async (data) => {
  return Order.create(data);
};

/**
 * Lấy danh sách order (phân trang)
 */
const getOrders = async (filter = {}, options = {}) => {
  return Order.paginate(filter, options);
};

/**
 * Lấy chi tiết order
 */
const getOrderById = async (id) => {
  const order = await Order.findById(id).populate("customer table");
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  return order;
};

/**
 * Cập nhật order
 */
const updateOrder = async (id, data) => {
  const order = await Order.findByIdAndUpdate(id, data, { new: true });
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  return order;
};

/**
 * Xóa order
 */
const deleteOrder = async (id) => {
  const order = await Order.findById(id);
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  await order.delete();
  return order;
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
