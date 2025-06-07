const express = require("express");
const controller = require("../controllers/orderDetailController");
const { auth, authorize } = require("../middlewares/auth");
const router = express.Router();
const ALLOW_ROLE = ["manager", "admin", "staff"];
const ALL_ROLE = ["manager", "admin", "staff", "customer"];

router.post("/", auth, authorize(...ALL_ROLE), controller.createOrderDetail);
router.get("/order/:orderId", auth, authorize(...ALLOW_ROLE), controller.getDetailsByOrder);
router.get("/all", controller.getAllOrderDetails);
router.get("/:id", auth, authorize(...ALLOW_ROLE), controller.getOrderDetailById);
router.put("/:id", auth, authorize(...ALLOW_ROLE), controller.updateOrderDetail);
router.delete("/:id", auth, authorize(...ALLOW_ROLE), controller.deleteOrderDetail);

module.exports = router;
