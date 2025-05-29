const Combo = require("../models/Combo");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const createComboItem = async (comboBody) => {
  return await Combo.create(comboBody);
};

const getComboItems = async (comboId) => {
  const result = await Combo.find({ combo: comboId }).populate("dish").exec();
  return result;
};

/**
 * Cập nhật số lượng món con trong combo
 */
const updateComboItem = async (id, updateBody) => {
  const comboItem = await Combo.findById(id);
  if (!comboItem) throw new ApiError(httpStatus.NOT_FOUND, "Combo item not found");
  Object.assign(comboItem, updateBody);
  await comboItem.save();
  return comboItem;
};

/**
 * Xóa 1 món con khỏi combo
 */
const deleteComboItem = async (id) => {
  const comboItem = await Combo.findById(id);
  if (!comboItem) throw new ApiError(httpStatus.NOT_FOUND, "Combo item not found");
  await comboItem.delete();
  return comboItem;
};

module.exports = {
  createComboItem,
  getComboItems,
  updateComboItem,
  deleteComboItem,
};
