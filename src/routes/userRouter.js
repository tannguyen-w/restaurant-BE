const express = require("express");
const userController = require("../controllers/userController");
const { auth, authorize } = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Các thư mục lưu ảnh
const AVATAR_DIR = path.join(__dirname, "../public/images/avatars");

// Đảm bảo thư mục tồn tại
if (!fs.existsSync(AVATAR_DIR)) fs.mkdirSync(AVATAR_DIR, { recursive: true });

// Multer config cho avatar user (chỉ 1 file/avatar)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, AVATAR_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  },
});
const upload = multer({ storage });

const router = express.Router();

router.post("/register", userController.register);

router.post("/", auth, authorize("admin"), upload.single("avatar"), userController.createUser);

router.get("/", userController.getUsers);

router.get("/me", auth, userController.getMe);

router.put("/me", auth, upload.single("avatar"), userController.updateProfile);

router.post("/change-password", auth, userController.changePassword);

router.post("/forgot-password", userController.forgotPassword);

router.post("/reset-password", userController.resetPassword);

router.get("/customers", userController.getCustomers);
router.get("/staffs", userController.getStaffs);

router.get("/:id", auth, authorize("admin"), userController.getUser);

router.put("/:id", auth, authorize("admin"), upload.single("avatar"), userController.updateUser);

router.delete("/:id", auth, authorize("admin"), userController.deleteUser);

module.exports = router;
