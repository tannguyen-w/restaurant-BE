const express = require("express");
const importInvoiceDetailController = require("../controllers/importInvoiceDetailController");
const { auth, authorize } = require("../middlewares/auth");
const router = express.Router();

const ALLOW_ROLE = ["manager", "admin", "staff"];

// Thêm chi tiết phiếu nhập
router.post(
  "/",
  auth,
  authorize(...ALLOW_ROLE),
  importInvoiceDetailController.createImportInvoiceDetail
);

// Lấy tất cả chi tiết của 1 phiếu nhập
router.get(
  "/invoice/:importInvoiceId",
  auth,
  authorize(...ALLOW_ROLE),
  importInvoiceDetailController.getDetailsByInvoice
);

router.get(
  "/",
  auth,
  authorize(...ALLOW_ROLE),
  importInvoiceDetailController.getDetailsAll
);

// Lấy 1 chi tiết phiếu nhập
router.get(
  "/:id",
  auth,
  authorize(...ALLOW_ROLE),
  importInvoiceDetailController.getDetailById
);

// Cập nhật chi tiết phiếu nhập
router.put(
  "/:id",
  auth,
  authorize(...ALLOW_ROLE),
  importInvoiceDetailController.updateImportInvoiceDetail
);

// Xóa chi tiết phiếu nhập
router.delete(
  "/:id",
  auth,
  authorize(...ALLOW_ROLE),
  importInvoiceDetailController.deleteImportInvoiceDetail
);

module.exports = router;
