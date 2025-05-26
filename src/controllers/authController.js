const httpStatus = require("http-status");
const authService = require("../services/authService");
const ApiError = require("../utils/ApiError");

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.send(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};
