const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const login = async (username, password) => {
  const user = await User.findOne({ username }).populate("role");
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Sai tên đăng nhập hoặc mật khẩu");
  }
  return user;
};

module.exports = {
  login,
};
