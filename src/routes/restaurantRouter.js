const express = require("express");
const restaurantController = require("../controllers/restaurantController");
const { auth, authorize } = require("../middlewares/auth");

const router = express.Router();

// Chỉ admin mới được CRUD restaurant
router
  .route("/")
  .post(auth, authorize("admin"), restaurantController.createRestaurant)
  .get(restaurantController.getRestaurants);

router
  .route("/:id")
  .get(restaurantController.getRestaurant)
  .put(auth, authorize("admin"), restaurantController.updateRestaurant)
  .delete(auth, authorize("admin"), restaurantController.deleteRestaurant);

module.exports = router;
