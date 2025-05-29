const catchAsync = require("../utils/catchAsync");
const dishService = require("../services/dishService");
const pick = require("../utils/pick");

// Tạo mới dish (hỗ trợ upload nhiều ảnh)
const createDish = catchAsync(async (req, res) => {
  const dishData = req.body;
  const files = req.files;
  const dish = await dishService.createDish(dishData, files);
  res.status(201).json(dish);
});

// Lấy danh sách dish
const getDishes = catchAsync(async (req, res, next) => {
  const filter = pick(req.query, ["name", "category", "isCombo"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await dishService.queryDishes(filter, options);
  res.send(result);
});

// Lấy chi tiết dish
const getDish = catchAsync(async (req, res, next) => {
  try {
    const dish = await dishService.getDishById(req.params.dishId);
    res.json(dish);
  } catch (err) {
    next(err);
  }
});

// Cập nhật dish (có thể upload thêm ảnh)
const updateDish = catchAsync(async (req, res) => {
  const files = req.files;
  const dish = await dishService.updateDishById(req.params.dishId, req.body, files);
  res.send(dish);
});

// Xóa dish
const deleteDish = catchAsync(async (req, res) => {
  await dishService.deleteDishById(req.params.dishId);
  res.status(204).send();
});

module.exports = {
  createDish,
  getDishes,
  getDish,
  updateDish,
  deleteDish,
};
