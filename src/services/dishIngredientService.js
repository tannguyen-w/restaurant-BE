const DishIngredient = require("../models/DishIngredient");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

// Tạo mới
const createDishIngredient = async (data) => {
  return DishIngredient.create(data);
};

// Lấy tất cả nguyên liệu của một món
const getByDish = async (dishId) => {
  return DishIngredient.find({ dish: dishId }).populate({
      path: 'ingredient',
      populate: {
        path: 'category',
        select: 'name' // Chỉ lấy các trường cần thiết
      }
    });;
};

// Lấy tất cả món dùng một nguyên liệu
const getByIngredient = async (ingredientId) => {
  return DishIngredient.find({ ingredient: ingredientId }).populate("dish");
};

// Lấy chi tiết
const getById = async (id) => {
  const doc = await DishIngredient.findById(id).populate("dish ingredient");
  if (!doc) throw new ApiError(httpStatus.NOT_FOUND, "DishIngredient not found");
  return doc;
};

// Cập nhật
const updateDishIngredient = async (id, data) => {
  const doc = await DishIngredient.findByIdAndUpdate(id, data, { new: true });
  if (!doc) throw new ApiError(httpStatus.NOT_FOUND, "DishIngredient not found");
  return doc;
};

// Xóa
const deleteDishIngredient = async (id) => {
  const doc = await DishIngredient.findById(id);
  if (!doc) throw new ApiError(httpStatus.NOT_FOUND, "DishIngredient not found");
  await doc.delete();
  return doc;
};

module.exports = {
  createDishIngredient,
  getByDish,
  getByIngredient,
  getById,
  updateDishIngredient,
  deleteDishIngredient,
};
