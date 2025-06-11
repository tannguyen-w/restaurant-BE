const express = require("express");
const controller = require("../controllers/invoiceController");
const { auth, authorize } = require("../middlewares/auth");
const router = express.Router();

const ALLOW_ROLE = ["manager", "admin", "staff"];
const ALL_ROLE = ["manager", "admin", "staff", "customer"];

router.post("/", auth, authorize(...ALL_ROLE), controller.createInvoice);
router.get("/", auth, authorize(...ALLOW_ROLE), controller.getInvoices);
router.get("/check/:idOrder", auth, authorize(...ALLOW_ROLE), controller.getCheckOrderInvoice);
router.get("/:id", auth, authorize(...ALLOW_ROLE), controller.getInvoiceById);
router.put("/:id", auth, authorize(...ALLOW_ROLE), controller.updateInvoice);
router.delete("/:id", auth, authorize(...ALLOW_ROLE), controller.deleteInvoice);

module.exports = router;
