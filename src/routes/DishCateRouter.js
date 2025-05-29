const express = require("express");
const DishCategoryController = require("../controllers/DishCategoryController");
const { auth, authorize } = require("../middlewares/auth");

const router = express.Router();

const ALLOW_ROLE = ["manager", "admin", "staff"];

// Ai cũng xem được danh sách, chi tiết
router.get("/", DishCategoryController.getAll);
router.get("/:id", DishCategoryController.getById);

// Tạo, cập nhật, xóa: chỉ admin, manager mới được thao tác
router.post("/", auth, authorize(...ALLOW_ROLE), DishCategoryController.create);
router.put("/:id", auth, authorize(...ALLOW_ROLE), DishCategoryController.update);
router.delete("/:id", auth, authorize(...ALLOW_ROLE), DishCategoryController.remove);

module.exports = router;
