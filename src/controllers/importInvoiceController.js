const catchAsync = require("../utils/catchAsync");
const importInvoiceService = require("../services/importInvoiceService");

/**
 * Tạo mới phiếu nhập kho
 */
const createImportInvoice = catchAsync(async (req, res) => {
  const invoice = await importInvoiceService.createImportInvoice(req.body);
  res.status(201).send(invoice);
});

/**
 * Lấy danh sách phiếu nhập kho (có phân trang)
 */
const getImportInvoices = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, startDate, endDate, ...otherFilters } = req.query;

  const filter = {
    ...otherFilters,
  };

  // Chỉ thêm startDate và endDate vào filter khi chúng tồn tại
  if (startDate) filter.startDate = startDate;
  if (endDate) filter.endDate = endDate;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createAt: -1 },
    populate: "supplier staff",
  };

  const result = await importInvoiceService.getImportInvoices(filter, options);
  res.status(201).send(result);
});

/**
 * Lấy chi tiết phiếu nhập kho
 */
const getImportInvoiceById = catchAsync(async (req, res) => {
  const invoice = await importInvoiceService.getImportInvoiceById(req.params.id);
  res.status(201).send(invoice);
});

/**
 * Cập nhật phiếu nhập kho
 */
const updateImportInvoice = catchAsync(async (req, res) => {
  const invoice = await importInvoiceService.updateImportInvoice(req.params.id, req.body);
  res.status(201).send(invoice);
});

/**
 * Xóa phiếu nhập kho
 */
const deleteImportInvoice = catchAsync(async (req, res) => {
  await importInvoiceService.deleteImportInvoice(req.params.id);
  res.status(200).send();
});

module.exports = {
  createImportInvoice,
  getImportInvoices,
  getImportInvoiceById,
  updateImportInvoice,
  deleteImportInvoice,
};
