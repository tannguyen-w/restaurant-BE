const express = require("express");
const authController = require("../controllers/authController");
const { auth, authorize } = require("../middlewares/auth");

const router = express.Router();

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refreshToken);

module.exports = router;
