const multer = require("multer");
const path = require("path");
const { createUploadPath, deleteOldFile } = require("../utils/file");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

// Cấu hình storage cho từng loại upload
const configureStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = createUploadPath(destination);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
};

// Validate file type
const fileFilter = (allowedMimeTypes) => (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(httpStatus.BAD_REQUEST, `Chỉ chấp nhận file ảnh (${allowedMimeTypes.join(", ")})`), false);
  }
};

// Cấu hình chung
const commonConfig = {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5, // Giới hạn số lượng file
  },
  onError: (err) => {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      err.code === "LIMIT_FILE_SIZE" ? "File quá lớn (tối đa 5MB)" : err.message
    );
  },
};

// Các loại upload
const uploadConfigs = {
  avatar: {
    storage: configureStorage("avatar"),
    fileFilter: fileFilter(["image/jpeg", "image/png"]),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB cho avatar
  },
  dishImages: {
    storage: configureStorage("dishes"),
    fileFilter: fileFilter(["image/jpeg", "image/png", "image/webp"]),
    limits: { files: 10 }, // Tối đa 10 ảnh cho món ăn
  },
  ingredientImage: {
    storage: configureStorage("ingredients"),
    fileFilter: fileFilter(["image/jpeg", "image/png"]),
  },
};

// Tạo các middleware upload
const uploaders = {
  singleAvatar: multer({
    ...commonConfig,
    ...uploadConfigs.avatar,
  }).single("avatar"),

  multipleDishImages: multer({
    ...commonConfig,
    ...uploadConfigs.dishImages,
  }).array("images", 5), // Tối đa 5 ảnh

  singleIngredientImage: multer({
    ...commonConfig,
    ...uploadConfigs.ingredientImage,
  }).single("image"),

  mixedFields: (fields) =>
    multer({
      ...commonConfig,
      storage: configureStorage("mixed"),
    }).fields(fields),
};

// Middleware xử lý lỗi tập trung
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err instanceof ApiError) {
    next(new ApiError(httpStatus.BAD_REQUEST, err.message));
  } else {
    next(err);
  }
};

module.exports = {
  ...uploaders,
  handleUploadError,
};
