const Order = require("../models/Order");
const Table = require("../models/Table");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

/**
 * Tạo mới order
 * data: { customer, table, status, orderTime }
 */
const createOrder = async (data) => {
  // 1. Tạo order
  const order = await Order.create(data);

  // 2. Đưa bàn vào trạng thái 'in_use'
  if (order.table) {
    await Table.findByIdAndUpdate(order.table, { status: "in_use" });
  }
  return order;
};

const getOrdersByCustomer = async (customerId, options = {}) => {
  const filter = { customer: customerId };
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  // Truy vấn không qua paginate để đảm bảo sort đúng
  const docs = await Order.find(filter)
    .sort({ createdAt: -1 }) // Đảm bảo mới nhất đầu tiên
    .skip(skip)
    .limit(limit)
    .populate(options.populate || "");

  // Đếm tổng số document
  const totalDocs = await Order.countDocuments(filter);

  return {
    results: docs,
    page: page,
    limit: limit,
    totalPages: Math.ceil(totalDocs / limit),
    totalResults: totalDocs,
  };
};
const getOrders = async (filter = {}, options = {}) => {
  return Order.paginate(filter, options);
};

const getOrderById = async (id) => {
  const order = await Order.findById(id).populate("customer table");
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  return order;
};

const updateOrder = async (id, data) => {
  const order = await Order.findByIdAndUpdate(id, data, { new: true });
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  return order;
};

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
  getOrdersByCustomer,
};
