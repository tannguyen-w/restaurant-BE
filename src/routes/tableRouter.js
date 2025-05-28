const express = require("express");
const tableController = require("../controllers/tableController");
const { auth, authorize } = require("../middlewares/auth");

const router = express.Router();

// Phân quyền cho các role được phép CRUD Table
const ALLOW_ROLE = ["manager", "admin"];

router.post("/", auth, authorize(...ALLOW_ROLE), tableController.createTable);

router.get("/", auth, authorize(...ALLOW_ROLE), tableController.getTables);

router.get("/:id", auth, authorize(...ALLOW_ROLE), tableController.getTable);

router.put("/:id", auth, authorize(...ALLOW_ROLE), tableController.updateTable);

router.delete("/:id", auth, authorize(...ALLOW_ROLE), tableController.deleteTable);

// Lấy tất cả table thuộc 1 nhà hàng
router.get("/restaurant/:restaurantId", auth, authorize(...ALLOW_ROLE), tableController.getTablesByRestaurant);

module.exports = router;
