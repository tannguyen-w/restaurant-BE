const catchAsync = require("../utils/catchAsync");
const reservationService = require("../services/reservationService");

// Tạo mới
const createReservation = catchAsync(async (req, res) => {
  try {
    const reservationData = req.body;

    // Gán customer là người dùng hiện tại nếu không được chỉ định
    if (!reservationData.customer && req.user) {
      reservationData.customer = req.user._id;
    }

    const reservation = await reservationService.createReservation(reservationData);
    res.status(201).json(reservation);
  } catch (err) {
    next(err);
  }
});

const checkTableReservation = catchAsync(async (req, res) => {
  const { tableId } = req.params;
  const { reservation_time, timeSlot } = req.query;

  // Kiểm tra xem bàn có còn trống không
  const isAvailable = await reservationService.checkTableReservation(tableId, reservation_time, timeSlot);
  res.send(isAvailable);
});

const getMyReservations = catchAsync(async (req, res) => {
  const customerId = req.user._id; // Lấy ID khách hàng từ token
  const options = {
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 10, // Đảm bảo lấy limit từ query
    populate: "table",
  };
  const reservations = await reservationService.getMyReservations(customerId, options);
  res.send(reservations);
});

// Lấy danh sách (phân trang)
const getReservations = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, ...filter } = req.query;
  const options = { page: parseInt(page), limit: parseInt(limit), sort: { reservation_time: -1 } };
  const result = await reservationService.getReservations(filter, options);
  res.send(result);
});

// Lấy chi tiết
const getReservationById = catchAsync(async (req, res) => {
  const reservation = await reservationService.getReservationById(req.params.id);
  res.send(reservation);
});

// Cập nhật
const updateReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.updateReservation(req.params.id, req.body);
  res.send(reservation);
});

// Xóa
const deleteReservation = catchAsync(async (req, res) => {
  await reservationService.deleteReservation(req.params.id);
  res.status(204).send();
});

module.exports = {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  getMyReservations,
  checkTableReservation,
};
