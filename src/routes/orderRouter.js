const express = require("express");
const controller = require("../controllers/orderController");
const { auth, authorize } = require("../middlewares/auth");
const router = express.Router();

const ALLOW_ROLE = ["manager", "admin", "staff"];

const ALL_ROLE = ["manager", "admin", "staff", "customer"];

router.post("/", auth, authorize(...ALL_ROLE), controller.createOrder);
router.get("/my-orders", auth, controller.getMyOrders);
router.get("/by-customer/:customerId", auth, authorize("admin", "manager"), controller.getOrdersByCustomer);
router.get("/", auth, authorize(...ALLOW_ROLE), controller.getOrders);
router.get("/restaurant/:restaurantId", auth, authorize(...ALLOW_ROLE), controller.getOrdersByRestaurant);
router.get("/:id", auth, authorize(...ALL_ROLE), controller.getOrderById);
router.put("/:id", auth, authorize(...ALLOW_ROLE), controller.updateOrder);
router.delete("/:id", auth, authorize(...ALLOW_ROLE), controller.deleteOrder);

// Lấy đơn hàng theo customer ID (cho admin/staff)

// Lấy đơn hàng của chính user đang đăng nhập

module.exports = router;
