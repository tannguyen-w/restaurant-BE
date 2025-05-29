const ImportInvoice = require("../models/ImportInvoice");
const ImportInvoiceDetail = require("../models/ImportInvoiceDetail");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

/**
 * Tạo mới phiếu nhập kho (và các chi tiết nếu có)
 * data: { supplier, import_date, total_amount, staff, details: [{ingredient, quantity, unit_price}] }
 */
const createImportInvoice = async (data) => {
  const { details, ...invoiceData } = data;
  const invoice = await ImportInvoice.create(invoiceData);
  if (details && Array.isArray(details) && details.length > 0) {
    await Promise.all(
      details.map((item) =>
        ImportInvoiceDetail.create({
          ...item,
          import_invoice: invoice._id,
        })
      )
    );
  }
  return invoice;
};

/**
 * Lấy danh sách phiếu nhập (có phân trang)
 */
const getImportInvoices = async (filter = {}, options = {}) => {
  return ImportInvoice.paginate(filter, options);
};

/**
 * Lấy chi tiết 1 phiếu nhập (bao gồm details)
 */
const getImportInvoiceById = async (id) => {
  const invoice = await ImportInvoice.findById(id).populate("supplier").populate("staff");
  if (!invoice) throw new ApiError(httpStatus.NOT_FOUND, "Import invoice not found");
  const details = await ImportInvoiceDetail.find({ import_invoice: id }).populate("ingredient");
  return { ...invoice.toObject(), details };
};

/**
 * Cập nhật phiếu nhập (không cập nhật details ở đây)
 */
const updateImportInvoice = async (id, data) => {
  const invoice = await ImportInvoice.findByIdAndUpdate(id, data, { new: true });
  if (!invoice) throw new ApiError(httpStatus.NOT_FOUND, "Import invoice not found");
  return invoice;
};

/**
 * Xóa phiếu nhập + detail
 */
const deleteImportInvoice = async (id) => {
  await ImportInvoiceDetail.deleteMany({ import_invoice: id });
  const result = await ImportInvoice.delete({ _id: id });
  return result;
};

module.exports = {
  createImportInvoice,
  getImportInvoices,
  getImportInvoiceById,
  updateImportInvoice,
  deleteImportInvoice,
};
