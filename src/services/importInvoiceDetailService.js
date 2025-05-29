const ImportInvoiceDetail = require("../models/ImportInvoiceDetail");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

/**
 * Tạo mới chi tiết phiếu nhập
 * data = { import_invoice, ingredient, quantity, unit_price }
 */
const createImportInvoiceDetail = async (data) => {
  return ImportInvoiceDetail.create(data);
};

/**
 * Lấy tất cả chi tiết của 1 phiếu nhập
 */
const getDetailsByInvoice = async (importInvoiceId) => {
  return ImportInvoiceDetail.find({ import_invoice: importInvoiceId }).populate("ingredient");
};

/**
 * Lấy 1 chi tiết phiếu nhập theo id
 */
const getDetailById = async (id) => {
  const detail = await ImportInvoiceDetail.findById(id).populate("ingredient");
  if (!detail) throw new ApiError(httpStatus.NOT_FOUND, "Import invoice detail not found");
  return detail;
};

/**
 * Cập nhật chi tiết phiếu nhập
 */
const updateImportInvoiceDetail = async (id, data) => {
  const detail = await ImportInvoiceDetail.findByIdAndUpdate(id, data, { new: true });
  if (!detail) throw new ApiError(httpStatus.NOT_FOUND, "Import invoice detail not found");
  return detail;
};

/**
 * Xóa chi tiết phiếu nhập
 */
const deleteImportInvoiceDetail = async (id) => {
  const detail = await ImportInvoiceDetail.findById(id);
  if (!detail) throw new ApiError(httpStatus.NOT_FOUND, "Import invoice detail not found");
  await detail.delete();
  return detail;
};

module.exports = {
  createImportInvoiceDetail,
  getDetailsByInvoice,
  getDetailById,
  updateImportInvoiceDetail,
  deleteImportInvoiceDetail,
};
