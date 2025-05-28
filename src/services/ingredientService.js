const Ingredient = require("../models/Ingredient");
const IngredientCategory = require("../models/IngredientCategory");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

// Tạo mới Ingredient
const createIngredient = async (data) => {
  const ingredientCategory = await IngredientCategory.findOne({ name: data.category });
  data.category = ingredientCategory._id;
  const exist = await Ingredient.findOne({ name: data.name });
  if (exist) throw new ApiError(httpStatus.BAD_REQUEST, "Ingredient name already exists");
  return Ingredient.create(data);
};

// Lấy danh sách Ingredient (có phân trang nếu có paginate)
const getIngredients = async (filter = {}, options = {}) => {
  return Ingredient.paginate ? Ingredient.paginate(filter, options) : Ingredient.find(filter);
};

// Lấy chi tiết một Ingredient
const getIngredientById = async (id) => {
  const ingredient = await Ingredient.findById(id);
  if (!ingredient) throw new ApiError(httpStatus.NOT_FOUND, "Ingredient not found");
  return ingredient;
};

// Cập nhật Ingredient
const updateIngredientById = async (id, updateData) => {
  const ingredient = await getIngredientById(id);
  Object.assign(ingredient, updateData);
  await ingredient.save();
  return ingredient;
};

// Xóa Ingredient
const deleteIngredientById = async (id) => {
  const ingredient = await getIngredientById(id);
  await ingredient.deleteOne();
  return ingredient;
};

module.exports = {
  createIngredient,
  getIngredients,
  getIngredientById,
  updateIngredientById,
  deleteIngredientById,
};
