const fs = require("fs");
const path = require("path");

const UPLOAD_BASE_DIR = path.join(__dirname, "../../uploads");

const createUploadPath = (type) => {
  const typeDirs = {
    avatar: "users/avatars",
    dishes: "dishes/images",
    ingredients: "ingredients",
    mixed: "mixed",
  };

  const dirPath = path.join(UPLOAD_BASE_DIR, typeDirs[type] || "others");

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  return dirPath;
};

const deleteOldFile = (filePath) => {
  if (!filePath) return;

  const fullPath = path.join(UPLOAD_BASE_DIR, filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

module.exports = {
  createUploadPath,
  deleteOldFile,
};
