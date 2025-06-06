const catchAsync = require("../utils/catchAsync");
const reservationService = require("../services/reservationService");

// Tạo mới
const createReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.createReservation(req.body);
  res.status(201).send(reservation);
});

const getMyReservations = catchAsync(async (req, res) => {
  const customerId = req.user._id; // Lấy ID khách hàng từ token
  const options = { populate: 'table', sort: { reservation_time: -1 } }; // Sắp xếp theo thời gian đặt bàn mới nhất
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
  deleteReservation,getMyReservations
};
