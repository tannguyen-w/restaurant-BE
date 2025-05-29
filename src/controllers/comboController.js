const catchAsync = require("../utils/catchAsync");
const comboService = require("../services/comboService");

// Thêm món con vào combo
const createComboItem = catchAsync(async (req, res) => {
  const comboItem = await comboService.createComboItem(req.body);
  res.status(201).send(comboItem);
});

// Lấy danh sách món con của 1 combo
const getComboItems = catchAsync(async (req, res) => {
  const items = await comboService.getComboItems(req.params.comboId);
  res.status(201).send(items);
});

// Cập nhật số lượng món con trong combo
const updateComboItem = catchAsync(async (req, res) => {
  const item = await comboService.updateComboItem(req.params.id, req.body);
  res.status(201).send(item);
});

// Xóa món con khỏi combo
const deleteComboItem = catchAsync(async (req, res) => {
  await comboService.deleteComboItem(req.params.id);
  res.status(204).send();
});

module.exports = {
  createComboItem,
  getComboItems,
  updateComboItem,
  deleteComboItem,
};
