const catchAsync = require("../utils/catchAsync");
const invoiceService = require("../services/invoiceService");

const createInvoice = catchAsync(async (req, res) => {
  const invoice = await invoiceService.createInvoice(req.body);
  res.status(201).send(invoice);
});

const getInvoices = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, ...filter } = req.query;
  const options = { page: parseInt(page), limit: parseInt(limit), sort: { payment_time: -1 }, populate: "order" };
  const result = await invoiceService.getInvoices(filter, options);
  res.send(result);
});

const getInvoiceById = catchAsync(async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(req.params.id);
  res.send(invoice);
});

const updateInvoice = catchAsync(async (req, res) => {
  const invoice = await invoiceService.updateInvoice(req.params.id, req.body);
  res.send(invoice);
});

const deleteInvoice = catchAsync(async (req, res) => {
  await invoiceService.deleteInvoice(req.params.id);
  res.status(204).send();
});

const getCheckOrderInvoice = catchAsync(async (req, res) => {
  const invoice = await invoiceService.getCheckOrderInvoice(req.params.idOrder);
  res.send(invoice);
});

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getCheckOrderInvoice,
};
