const express = require("express");
const ingredientCategoryController = require("../controllers/ingredientCategoryController");
const { auth, authorize } = require("../middlewares/auth");

const router = express.Router();

// Các role được phép CRUD
const ALLOW_ROLE = ["staff", "manager", "admin"];

router.post("/", auth, authorize(...ALLOW_ROLE), ingredientCategoryController.createIngredientCategory);
router.get("/", auth, authorize(...ALLOW_ROLE), ingredientCategoryController.getIngredientCategories);
router.get("/:id", auth, authorize(...ALLOW_ROLE), ingredientCategoryController.getIngredientCategory);
router.put("/:id", auth, authorize(...ALLOW_ROLE), ingredientCategoryController.updateIngredientCategory);
router.delete("/:id", auth, authorize(...ALLOW_ROLE), ingredientCategoryController.deleteIngredientCategory);

module.exports = router;
