const Reservation = require("../models/Reservation");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

// Tạo mới
const createReservation = async (data) => {
  return Reservation.create(data);
};

// Lấy danh sách (có phân trang)
const getReservations = async (filter = {}, options = {}) => {
  return Reservation.paginate(filter, options);
};

// Lấy chi tiết
const getReservationById = async (id) => {
  const resv = await Reservation.findById(id).populate("customer").populate("table");
  if (!resv) throw new ApiError(httpStatus.NOT_FOUND, "Reservation not found");
  return resv;
};

// Cập nhật
const updateReservation = async (id, data) => {
  const resv = await Reservation.findByIdAndUpdate(id, data, { new: true });
  if (!resv) throw new ApiError(httpStatus.NOT_FOUND, "Reservation not found");
  return resv;
};

// Xóa
const deleteReservation = async (id) => {
  const resv = await Reservation.findById(id);
  if (!resv) throw new ApiError(httpStatus.NOT_FOUND, "Reservation not found");
  await resv.delete();
  return resv;
};

const getMyReservations = async (customerId, options = {}) => {
  const filter = { customer: customerId };
  
  // Đảm bảo chúng ta populate các trường liên quan
  if (!options.populate) {
    options.populate = 'table';
  }
  
  // Sắp xếp theo thời gian đặt bàn mới nhất nếu không chỉ định
  if (!options.sort) {
    options.sort = { reservationDate: -1, reservationTime: -1 };
  }
  
  return Reservation.paginate(filter, options);
};

module.exports = {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,getMyReservations
};
