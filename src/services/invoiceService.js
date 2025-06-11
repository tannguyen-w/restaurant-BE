const OrderDetail = require("../models/OrderDetail");
const Invoice = require("../models/Invoice");
const Order = require("../models/Order");
const Table = require("../models/Table");
const MemberCard = require("../models/MemberCard");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const createInvoice = async (data) => {
  // 1. Lấy các order detail của order
  const orderDetails = await OrderDetail.find({ order: data.order });
  if (!orderDetails.length) throw new ApiError(httpStatus.BAD_REQUEST, "Order has no items");

  // 2. Tính tổng tiền món ăn
  const total_amount = orderDetails.reduce((sum, d) => sum + d.quantity * d.price, 0);
  data.total_amount = total_amount;

  // 3. Tính final_amount
  data.final_amount = total_amount - (data.discount || 0);

  // 4. Tạo hóa đơn
  const invoice = await Invoice.create(data);

  // 5. Các logic sau khi thanh toán như trước (cộng điểm, set bàn available...)
  const order = await Order.findById(invoice.order).populate("customer table");
  order.status = "finished";
  if (order?.customer) {
    const member = await MemberCard.findOne({ user: order.customer });
    if (member) {
      member.total_spent += data.final_amount;
      member.points += Math.floor(data.final_amount / 100);
      await member.save();
    }
  }
  if (order?.table) {
    await Table.findByIdAndUpdate(order.table, { status: "available" });
  }

  return invoice;
};

const getInvoices = async (filter = {}, options = {}) => {
  return Invoice.paginate(filter, options);
};

const getInvoiceById = async (id) => {
  const invoice = await Invoice.findById(id).populate("order");
  if (!invoice) throw new ApiError(httpStatus.NOT_FOUND, "Invoice not found");
  return invoice;
};

const updateInvoice = async (id, data) => {
  const invoiceCurrent = await getInvoiceById(id);
  const total_amount = invoiceCurrent.total_amount;

  const final_amount = total_amount - data.discount;

  const updateData = {
    ...data,
    final_amount: final_amount,
  };

  const invoice = await Invoice.findByIdAndUpdate(id, updateData, { new: true });
  if (!invoice) throw new ApiError(httpStatus.NOT_FOUND, "Invoice not found");
  return invoice;
};

const deleteInvoice = async (id) => {
  const invoice = await Invoice.findById(id);
  if (!invoice) throw new ApiError(httpStatus.NOT_FOUND, "Invoice not found");
  await invoice.delete();
  return invoice;
};

const getCheckOrderInvoice = async (orderId, throwError = false) => {
  // Kiểm tra đơn hàng tồn tại
  const order = await Order.findById(orderId);
  if (!order) {
    if (throwError) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    return { exists: false, message: "Order not found" };
  }

  // Tìm hóa đơn liên quan đến đơn hàng
  const invoice = await Invoice.findOne({ order: orderId });

  if (!invoice) {
    if (throwError) throw new ApiError(httpStatus.NOT_FOUND, "Invoice not found for this order");
    return { exists: false, message: "No invoice found for this order" };
  }

  return {
    exists: true,
    invoice: invoice,
    message: "Invoice exists for this order",
  };
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getCheckOrderInvoice,
};
