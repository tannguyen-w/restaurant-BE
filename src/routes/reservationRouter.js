const express = require("express");
const controller = require("../controllers/reservationController");
const { auth, authorize } = require("../middlewares/auth");
const router = express.Router();

const ALLOW_ROLE = ["manager", "admin", "staff"];
const ALL_ROLE = ["manager", "admin", "staff", "customer"];

// Tạo mới
router.post("/", auth, authorize(...ALL_ROLE), controller.createReservation);
// Lấy danh sách
router.get("/", auth, authorize(...ALL_ROLE), controller.getReservations);
router.get("/me", auth, controller.getMyReservations);
router.get("/:tableId/check-reservation", auth, controller.checkTableReservation);

// Lấy đặt bàn theo nhà hàng
router.get("/restaurant/:restaurantId", auth, authorize(...ALLOW_ROLE), controller.getReservationsByRestaurant);
// Cập nhật trạng thái đặt bàn
router.patch("/:id/status", auth, authorize(...ALLOW_ROLE), controller.updateReservationStatus);

// Lấy chi tiết
router.get("/:id", auth, authorize(...ALL_ROLE), controller.getReservationById);
// Cập nhật
router.put("/:id", auth, authorize(...ALLOW_ROLE), controller.updateReservation);
// Xóa
router.delete("/:id", auth, authorize(...ALLOW_ROLE), controller.deleteReservation);

module.exports = router;
