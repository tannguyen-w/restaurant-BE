const express = require("express");
const comboController = require("../controllers/comboController");
const { auth, authorize } = require("../middlewares/auth");

const router = express.Router();
const ALLOW_ROLE = ["manager", "admin"];

// Thêm món con vào combo
router.post("/", auth, authorize(...ALLOW_ROLE), comboController.createComboItem);

// Lấy tất cả món con của combo (comboId là _id của Dish dạng combo)
router.get("/:comboId", auth, authorize(...ALLOW_ROLE), comboController.getComboItems);

// Cập nhật số lượng món con trong combo
router.put("/:id", auth, authorize(...ALLOW_ROLE), comboController.updateComboItem);

// Xóa món con khỏi combo
router.delete("/:id", auth, authorize(...ALLOW_ROLE), comboController.deleteComboItem);

module.exports = router;
