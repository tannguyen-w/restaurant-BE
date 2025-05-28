const express = require("express");
const supplierController = require("../controllers/supplierController");
const { auth, authorize } = require("../middlewares/auth");

const router = express.Router();

// Chỉ staff, manager, admin được CRUD
const ALLOW_ROLE = ["staff", "manager", "admin"];

router.post("/", auth, authorize(...ALLOW_ROLE), supplierController.createSupplier);
router.get("/", auth, authorize(...ALLOW_ROLE), supplierController.getSuppliers);
router.get("/:id", auth, authorize(...ALLOW_ROLE), supplierController.getSupplier);
router.put("/:id", auth, authorize(...ALLOW_ROLE), supplierController.updateSupplier);
router.delete("/:id", auth, authorize(...ALLOW_ROLE), supplierController.deleteSupplier);

module.exports = router;
