const OrderDetail = require("../models/OrderDetail");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

// Tạo mới chi tiết order
const createOrderDetail = async (data) => {
  return OrderDetail.create(data);
};

const getAllOrderDetails = async (filter, options) => {
  return OrderDetail.paginate(filter, options);
};

// Lấy tất cả chi tiết của 1 order
const getDetailsByOrder = async (orderId) => {
  return OrderDetail.find({ order: orderId }).populate("dish");
};

// Lấy chi tiết 1 OrderDetail
const getOrderDetailById = async (id) => {
  const detail = await OrderDetail.findById(id).populate("order dish");
  if (!detail) throw new ApiError(httpStatus.NOT_FOUND, "Order detail not found");
  return detail;
};

// Cập nhật
const updateOrderDetail = async (id, data) => {
  const detail = await OrderDetail.findByIdAndUpdate(id, data, { new: true });
  if (!detail) throw new ApiError(httpStatus.NOT_FOUND, "Order detail not found");
  return detail;
};

// Xóa
const deleteOrderDetail = async (id) => {
  const detail = await OrderDetail.findById(id);
  if (!detail) throw new ApiError(httpStatus.NOT_FOUND, "Order detail not found");
  await detail.delete();
  return detail;
};

module.exports = {
  createOrderDetail,
  getDetailsByOrder,
  getOrderDetailById,
  updateOrderDetail,
  deleteOrderDetail,getAllOrderDetails
};
