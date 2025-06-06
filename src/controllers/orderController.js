const catchAsync = require("../utils/catchAsync");
const orderService = require("../services/orderService");

/**
 * Tạo mới order
 */
const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.status(201).send(order);
});

/**
 * Lấy danh sách order
 */
const getOrders = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, ...filter } = req.query;
  const options = { page: parseInt(page), limit: parseInt(limit), sort: { orderTime: -1 } };
  const result = await orderService.getOrders(filter, options);
  res.send(result);
});

/**
 * Lấy chi tiết order
 */
const getOrderById = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  res.send(order);
});

/**
 * Cập nhật order
 */
const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.updateOrder(req.params.id, req.body);
  res.send(order);
});

/**
 * Xóa order
 */
const deleteOrder = catchAsync(async (req, res) => {
  await orderService.deleteOrder(req.params.id);
  res.status(204).send();
});

const getMyOrders = async (req, res, next) => {
  try {
    const customerId = req.user._id;
    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
      populate: 'table',
      sort: { createdAt: -1 }
    };
    
    const result = await orderService.getOrdersByCustomer(customerId, options);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getOrdersByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
      populate: 'table',
      sort: { createdAt: -1 } // Mới nhất trước
    };
    
    const result = await orderService.getOrdersByCustomer(customerId, options);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,getMyOrders, getOrdersByCustomer
};
