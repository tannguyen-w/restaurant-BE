const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  // Lấy token từ header
  const token = req.cookies && req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = await User.findById(decoded.id).populate("role");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const authorize =
  (...roles) =>
  (req, res, next) => {
    const userRole = req.user.role && req.user.role.name ? req.user.role.name : req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };

module.exports = { auth, authorize };
