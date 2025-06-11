const express = require("express");
const tableController = require("../controllers/tableController");
const { auth, authorize } = require("../middlewares/auth");

const router = express.Router();

// Phân quyền cho các role được phép CRUD Table
const ALLOW_ROLE = ["manager", "admin", "staff"];

const ALL_ROLE = ["manager", "admin", "staff", "customer"];

router.post("/", auth, authorize(...ALLOW_ROLE), tableController.createTable);

router.get("/", auth, authorize(...ALL_ROLE), tableController.getTables);
router.get("/available", auth, authorize(...ALL_ROLE), tableController.getAvailableTables);

router.get("/:id", auth, authorize(...ALL_ROLE), tableController.getTable);

router.put("/:id", auth, authorize(...ALLOW_ROLE), tableController.updateTable);

router.delete("/:id", auth, authorize(...ALLOW_ROLE), tableController.deleteTable);

// Lấy tất cả table thuộc 1 nhà hàng
router.get("/restaurant/:restaurantId", auth, authorize(...ALL_ROLE), tableController.getTablesByRestaurant);

module.exports = router;
