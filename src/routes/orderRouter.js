const express = require("express");
const controller = require("../controllers/orderController");
const { auth, authorize } = require("../middlewares/auth");
const router = express.Router();

const ALLOW_ROLE = ["manager", "admin", "staff"];

const ALL_ROLE = ["manager", "admin", "staff", "customer"];

router.post("/", auth, authorize(...ALL_ROLE), controller.createOrder);
router.get("/", auth, authorize(...ALLOW_ROLE), controller.getOrders);
router.get("/:id", auth, authorize(...ALL_ROLE), controller.getOrderById);
router.put("/:id", auth, authorize(...ALLOW_ROLE), controller.updateOrder);
router.delete("/:id", auth, authorize(...ALLOW_ROLE), controller.deleteOrder);

module.exports = router;
