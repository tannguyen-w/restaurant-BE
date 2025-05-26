const express = require("express");
const roleController = require("../controllers/roleController");
const { auth, authorize } = require("../middlewares/auth");

const router = express.Router();

// Chỉ admin mới được CRUD restaurant

router.route("/").post(auth, authorize("admin"), roleController.createRole).get(roleController.getRoles);

router
  .route("/:id")
  .get(roleController.getRole)
  .put(auth, authorize("admin"), roleController.updateRole)
  .delete(auth, authorize("admin"), roleController.deleteRole);

module.exports = router;
