const OrderDetail = require("../models/OrderDetail");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const DishIngredient = require("../models/DishIngredient");
const Ingredient = require("../models/Ingredient");

// Tạo mới chi tiết order
const createOrderDetail = async (data) => {
  // 1. Tạo chi tiết đơn hàng
  const orderDetail = await OrderDetail.create(data);

  // 2. Trừ nguyên liệu
  const recipe = await DishIngredient.find({ dish: orderDetail.dish });
  for (const ingredient of recipe) {
    await Ingredient.findByIdAndUpdate(ingredient.ingredient, {
      $inc: { current_stock: -ingredient.quantity_per_dish * orderDetail.quantity },
    });
  }

  return orderDetail;
};

const getAllOrderDetails = async (filter, options) => {
  return OrderDetail.paginate(filter, options);
};

const getDetailsByOrder = async (orderId) => {
  const data = await OrderDetail.find({ order: orderId }).populate("dish");
  // Tính tổng tiền
  const total = data.reduce((sum, detail) => {
    return sum + (detail.price || 0) * (detail.quantity || 0);
  }, 0);
  return { data, total };
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
  deleteOrderDetail,
  getAllOrderDetails,
};
