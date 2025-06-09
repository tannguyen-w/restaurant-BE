const path = require("path");
const fs = require("fs");

const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

function makeDirIfNeeded(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getPublicPath(type) {
  switch (type) {
    case "avatar":
      return "/avatars";
    case "logo":
      return "/logo";
    case "dish":
      return "/dishes";
    case "ingredient":
      return "/ingredients";
    default:
      return "/upload";
  }
}

function getLocalPath(type) {
  return path.resolve(__dirname, "../public" + getPublicPath(type));
}

// Lưu 1 file (multerFile) vào đúng thư mục, trả về url public
const saveSingle = async (multerFile, type = "upload") => {
  console.log("Saving file:", multerFile);
  if (!multerFile) throw new Error("No file uploaded");
  const ext = path.extname(multerFile.originalname).toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) throw new Error("Invalid file type");
  const dir = getLocalPath(type);
  makeDirIfNeeded(dir);
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const destPath = path.join(dir, fileName);
  fs.renameSync(multerFile.path, destPath);
  return `${getPublicPath(type)}/${fileName}`;
};

// Lưu nhiều file, trả về mảng url public
const saveMultiple = async (multerFiles, type = "upload") => {
  if (!multerFiles || !multerFiles.length) return [];
  const urls = [];
  for (const file of multerFiles) {
    const url = await saveSingle(file, type);
    urls.push(url);
  }
  return urls;
};

module.exports = {
  saveSingle,
  saveMultiple,
};
