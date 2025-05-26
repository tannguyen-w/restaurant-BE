const express = require("express");
const router = express.Router();
const dishController = require("../controllers/dishController");
// const { authMiddleWare } = require("../middleware/auth");
const { uploadMultiple } = require("../middlewares/upload");

// router.post("/dish", upload.multipleDishImages, upload.handleUploadError, dishController.createDish);
// router.put("/update/:id", authMiddleWare, dishController.updateProduct);
// router.get("/get-details/:id", dishController.getDetailsProduct);
// router.delete("/delete/:id", authMiddleWare, dishController.deleteProduct);
router.get("/dishes", dishController.getDishes);
// router.post("/delete-many", authMiddleWare, dishController.deleteMany);
// router.get("/get-all-type", dishController.getAllType);

module.exports = router;
