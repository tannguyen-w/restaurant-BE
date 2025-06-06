const express = require("express");
const dishController = require("../controllers/dishController");
const { auth, authorize } = require("../middlewares/auth");
const { multipleDishImages, handleUploadError } = require("../middlewares/upload");

const router = express.Router();

const ALLOW_ROLE = ["staff", "manager", "admin"];

router.post("/", auth, authorize(...ALLOW_ROLE), multipleDishImages, handleUploadError, dishController.createDish);

router.get("/", dishController.getDishes);

router.get("/:dishId",  dishController.getDish);

router.put(
  "/:dishId",
  auth,
  authorize(...ALLOW_ROLE),
  multipleDishImages,
  handleUploadError,
  dishController.updateDish
);

router.delete("/:dishId", auth, authorize(...ALLOW_ROLE), dishController.deleteDish);

module.exports = router;
