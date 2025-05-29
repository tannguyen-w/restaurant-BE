const express = require("express");
const controller = require("../controllers/reservationController");
const { auth, authorize } = require("../middlewares/auth");
const router = express.Router();

const ALLOW_ROLE = ["manager", "admin", "staff"];

// Tạo mới
router.post("/", auth, authorize(...ALLOW_ROLE), controller.createReservation);
// Lấy danh sách
router.get("/", auth, authorize(...ALLOW_ROLE), controller.getReservations);
// Lấy chi tiết
router.get("/:id", auth, authorize(...ALLOW_ROLE), controller.getReservationById);
// Cập nhật
router.put("/:id", auth, authorize(...ALLOW_ROLE), controller.updateReservation);
// Xóa
router.delete("/:id", auth, authorize(...ALLOW_ROLE), controller.deleteReservation);

module.exports = router;
