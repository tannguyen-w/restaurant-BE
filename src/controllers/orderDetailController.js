const catchAsync = require("../utils/catchAsync");
const orderDetailService = require("../services/orderDetailService");

const createOrderDetail = catchAsync(async (req, res) => {
  const detail = await orderDetailService.createOrderDetail(req.body);
  res.status(201).send(detail);
});

const getAllOrderDetails = catchAsync(async (req, res) => {

  const { page = 1, limit = 20, ...filter } = req.query;
   const options = { page: parseInt(page), limit: parseInt(limit), sort: { orderTime: -1 } };
   const result = await orderDetailService.getAllOrderDetails(filter, options);
   res.send(result);
})


const getDetailsByOrder = catchAsync(async (req, res) => {
  const details = await orderDetailService.getDetailsByOrder(req.params.orderId);
  res.status(201).send(details);
});

const getOrderDetailById = catchAsync(async (req, res) => {
  const detail = await orderDetailService.getOrderDetailById(req.params.id);
  res.status(201).send(detail);
});

const updateOrderDetail = catchAsync(async (req, res) => {
  const detail = await orderDetailService.updateOrderDetail(req.params.id, req.body);
  res.status(201).send(detail);
});

const deleteOrderDetail = catchAsync(async (req, res) => {
  await orderDetailService.deleteOrderDetail(req.params.id);
  res.status(204).send();
});

module.exports = {
  createOrderDetail,
  getDetailsByOrder,
  getOrderDetailById,
  updateOrderDetail,
  deleteOrderDetail,getAllOrderDetails
};
