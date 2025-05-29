const catchAsync = require("../utils/catchAsync");
const importInvoiceDetailService = require("../services/importInvoiceDetailService");

/**
 * Tạo mới chi tiết phiếu nhập
 */
const createImportInvoiceDetail = catchAsync(async (req, res) => {
  const detail = await importInvoiceDetailService.createImportInvoiceDetail(req.body);
  res.status(201).send(detail);
});

/**
 * Lấy tất cả chi tiết của 1 phiếu nhập
 */
const getDetailsByInvoice = catchAsync(async (req, res) => {
  const details = await importInvoiceDetailService.getDetailsByInvoice(req.params.importInvoiceId);
  res.status(201).send(details);
});

/**
 * Lấy 1 chi tiết phiếu nhập
 */
const getDetailById = catchAsync(async (req, res) => {
  const detail = await importInvoiceDetailService.getDetailById(req.params.id);
  res.status(203).send(detail);
});

/**
 * Cập nhật chi tiết phiếu nhập
 */
const updateImportInvoiceDetail = catchAsync(async (req, res) => {
  const detail = await importInvoiceDetailService.updateImportInvoiceDetail(req.params.id, req.body);
  res.status(203).send(detail);
});

/**
 * Xóa chi tiết phiếu nhập
 */
const deleteImportInvoiceDetail = catchAsync(async (req, res) => {
  await importInvoiceDetailService.deleteImportInvoiceDetail(req.params.id);
  res.status(204).send();
});

module.exports = {
  createImportInvoiceDetail,
  getDetailsByInvoice,
  getDetailById,
  updateImportInvoiceDetail,
  deleteImportInvoiceDetail,
};
