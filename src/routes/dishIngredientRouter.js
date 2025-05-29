const express = require("express");
const controller = require("../controllers/dishIngredientController");
const { auth, authorize } = require("../middlewares/auth");
const router = express.Router();
const ALLOW_ROLE = ["admin", "manager", "staff"];

router.post("/", auth, authorize(...ALLOW_ROLE), controller.createDishIngredient);
router.get("/dish/:dishId", auth, authorize(...ALLOW_ROLE), controller.getByDish);
router.get("/ingredient/:ingredientId", auth, authorize(...ALLOW_ROLE), controller.getByIngredient);
router.get("/:id", auth, authorize(...ALLOW_ROLE), controller.getById);
router.put("/:id", auth, authorize(...ALLOW_ROLE), controller.updateDishIngredient);
router.delete("/:id", auth, authorize(...ALLOW_ROLE), controller.deleteDishIngredient);

module.exports = router;
