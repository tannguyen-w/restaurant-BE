const express = require("express");
const importInvoiceController = require("../controllers/importInvoiceController");
const { auth, authorize } = require("../middlewares/auth");
const router = express.Router();

const ALLOW_ROLE = ["manager", "admin", "staff"];

// Tạo mới phiếu nhập kho
router.post("/", auth, authorize(...ALLOW_ROLE), importInvoiceController.createImportInvoice);

// Lấy danh sách phiếu nhập kho
router.get("/", auth, authorize(...ALLOW_ROLE), importInvoiceController.getImportInvoices);

// Lấy chi tiết phiếu nhập kho
router.get("/:id", auth, authorize(...ALLOW_ROLE), importInvoiceController.getImportInvoiceById);

// Cập nhật phiếu nhập kho
router.put("/:id", auth, authorize(...ALLOW_ROLE), importInvoiceController.updateImportInvoice);

// Xóa phiếu nhập kho
router.delete("/:id", auth, authorize(...ALLOW_ROLE), importInvoiceController.deleteImportInvoice);

module.exports = router;
