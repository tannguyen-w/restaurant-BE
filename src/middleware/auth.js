const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).populate("role");
    if (!req.user) return res.status(401).json({ message: "Invalid user" });
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Kiểm tra quyền truy cập
const permit =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role.name) && !roles.includes("all")) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };

module.exports = { auth, permit };
