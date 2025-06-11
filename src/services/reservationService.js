const Reservation = require("../models/Reservation");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const isTableAvailable = async (tableId, reservationTime, timeSlot) => {
  // Tìm kiếm reservation đã tồn tại cho bàn này vào ngày và khung giờ này
  const existingReservation = await Reservation.findOne({
    table: tableId,
    reservation_time: reservationTime,
    timeSlot: timeSlot,
    status: { $in: ["pending", "confirmed"] }, // Chỉ kiểm tra các đơn đang chờ hoặc đã xác nhận
  });

  // Trả về true nếu không tìm thấy reservation (bàn còn trống)
  return !existingReservation;
};

const checkTableReservation = async (tableId, reservationTime, timeSlot) => {
  try {
    // Kiểm tra reservation trùng thời gian
    const existingReservation = await Reservation.findOne({
      table: tableId,
      reservation_time: reservationTime,
      timeSlot: timeSlot,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingReservation) {
      return {
        success: true,
        available: false,
        message: "Bàn đã có người đặt vào thời gian này",
      };
    }

    return {
      success: true,
      available: true,
      message: "Bàn còn trống và có thể đặt",
      table: table,
    };
  } catch (error) {
    return {
      success: false,
      available: false,
      message: "Lỗi khi kiểm tra bàn: " + error.message,
    };
  }
};

// Tạo mới
const createReservation = async (data) => {
  const isAvailable = await isTableAvailable(data.table, data.reservation_time, data.timeSlot);
  if (!isAvailable) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Bàn này đã có người đặt vào thời gian này. Vui lòng chọn bàn khác hoặc thời gian khác."
    );
  }

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
    options.populate = "table";
  }

  // Sắp xếp theo thời gian đặt bàn mới nhất nếu không chỉ định
  if (!options.sort) {
    options.sort = { reservation_time: -1 };
  }

  return Reservation.paginate(filter, options);
};

module.exports = {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  getMyReservations,
  checkTableReservation,
};
