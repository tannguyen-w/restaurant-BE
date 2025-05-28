const express = require("express");
const ingredientController = require("../controllers/ingredientController");
const { auth, authorize } = require("../middlewares/auth");

const router = express.Router();

// Các role được phép CRUD
const ALLOW_ROLE = ["staff", "manager", "admin"];

router.post("/", auth, authorize(...ALLOW_ROLE), ingredientController.createIngredient);
router.get("/", auth, authorize(...ALLOW_ROLE), ingredientController.getIngredients);
router.get("/:id", auth, authorize(...ALLOW_ROLE), ingredientController.getIngredient);
router.put("/:id", auth, authorize(...ALLOW_ROLE), ingredientController.updateIngredient);
router.delete("/:id", auth, authorize(...ALLOW_ROLE), ingredientController.deleteIngredient);

module.exports = router;
