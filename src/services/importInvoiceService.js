const ImportInvoice = require("../models/ImportInvoice");
const ImportInvoiceDetail = require("../models/ImportInvoiceDetail");
const Ingredient = require("../models/Ingredient");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const mongoose = require("mongoose");

/**
 * Tạo mới phiếu nhập kho (và các chi tiết nếu có)
 * data: { supplier, import_date, total_amount, staff, details: [{ingredient, quantity, unit_price}] }
 */
const createImportInvoice = async (data) => {
    const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { details, ...invoiceData } = data;
    
    // Tạo phiếu nhập trong transaction
    const invoice = await ImportInvoice.create([invoiceData], { session });
    const invoiceId = invoice[0]._id;
    
    if (details && Array.isArray(details) && details.length > 0) {
      // Tạo mảng chi tiết phiếu nhập với ID phiếu nhập
      const detailsWithInvoiceId = details.map(item => ({
        ...item,
        import_invoice: invoiceId
      }));
      
      // Tạo tất cả chi tiết phiếu nhập trong transaction
      await ImportInvoiceDetail.create(detailsWithInvoiceId, { session });
      
      // Cập nhật số lượng nguyên liệu trong transaction
      for (const item of details) {
        const ingredient = await Ingredient.findById(item.ingredient).session(session);
        
        if (!ingredient) {
          throw new ApiError(
            httpStatus.NOT_FOUND,
            `Không tìm thấy nguyên liệu với ID: ${item.ingredient}`
          );
        }
        
        await Ingredient.findByIdAndUpdate(
          item.ingredient,
          { 
            $inc: { current_stock: item.quantity },
            $set: { last_import_date: new Date() }
          },
          { new: true, session }
        );
      }
    }
    
    // Commit transaction khi tất cả thao tác thành công
    await session.commitTransaction();
    
    // Trả về phiếu nhập đã tạo
    return invoice[0];
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await session.abortTransaction();
    
    throw new ApiError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      `Lỗi khi tạo phiếu nhập: ${error.message}`
    );
  } finally {
    // Kết thúc session trong mọi trường hợp
    session.endSession();
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
