const express = require("express");
const router = express.Router();
const DishCategoryController = require("../controllers/DishCategoryController");
const { authMiddleWare } = require("../middleware/auth");

// router.post("/dish-category", DishCategoryController.createProduct);

module.exports = router;
