const Order = require("../models/Order");
const Table = require("../models/Table");
const OrderDetail = require("../models/OrderDetail");
const Ingredient = require("../models/Ingredient");
const DishIngredient = require("../models/DishIngredient");
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

  // 3. Trừ nguyên liệu theo từng OrderDetail
  const orderDetails = await OrderDetail.find({ order: order._id });
  for (const detail of orderDetails) {
    const recipe = await DishIngredient.find({ dish: detail.dish });
    for (const mat of recipe) {
      await Ingredient.findByIdAndUpdate(mat.ingredient, {
        $inc: { current_stock: -mat.quantity_per_dish * detail.quantity_per_dish },
      });
    }
  }
  return order;
};

const getOrdersByCustomer = async (customerId, options = {}) => {
  const filter = { customer: customerId };
  return Order.paginate(filter, options);
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
  deleteOrder,getOrdersByCustomer
};
