const catchAsync = require("../utils/catchAsync");
const dashboardService = require("../services/dashboardService");

/**
 * Lấy thông tin thống kê tổng quan
 */
const getGeneralStats = catchAsync(async (req, res) => {
  const { restaurantId } = req.query;
  const stats = await dashboardService.getGeneralStats(restaurantId);
  res.send(stats);
});

/**
 * Lấy thống kê doanh thu
 */
const getSalesStats = catchAsync(async (req, res) => {
  const { period = "monthly", startDate, endDate, restaurantId } = req.query;
  const stats = await dashboardService.getSalesStats(period, startDate, endDate, restaurantId);
  res.send(stats);
});

/**
 * Lấy thống kê đơn hàng
 */
const getOrderStats = catchAsync(async (req, res) => {
  const { period = "weekly", startDate, endDate, restaurantId } = req.query;
  const stats = await dashboardService.getOrderStats(period, startDate, endDate, restaurantId);
  res.send(stats);
});

/**
 * Lấy thống kê đặt bàn
 */
const getReservationStats = catchAsync(async (req, res) => {
  const { period = "daily", startDate, endDate, restaurantId } = req.query;
  const stats = await dashboardService.getReservationStats(period, startDate, endDate, restaurantId);
  res.send(stats);
});

/**
 * Lấy danh sách món ăn bán chạy nhất
 */
const getTopDishes = catchAsync(async (req, res) => {
  const { limit = 10, restaurantId } = req.query;
  const topDishes = await dashboardService.getTopDishes(parseInt(limit), restaurantId);
  res.send(topDishes);
});

/**
 * Lấy thông tin hoạt động người dùng
 */
const getUserActivity = catchAsync(async (req, res) => {
  const { days = 30, restaurantId } = req.query;
  const activity = await dashboardService.getUserActivity(parseInt(days), restaurantId);
  res.send(activity);
});

module.exports = {
  getGeneralStats,
  getSalesStats,
  getOrderStats,
  getReservationStats,
  getTopDishes,
  getUserActivity,
};
