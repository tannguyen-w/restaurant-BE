const Dish = require("../models/Dish");
const DishIngredient = require("../models/DishIngredient");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const fileService = require("./fileService");

const createDish = async (dishBody, files) => {
  // Xử lý lưu ảnh nếu có
  let images = [];
  if (files && files.length > 0) {
    images = await fileService.saveMultiple(files, "dish"); // Lưu vào public/dishes
  }
  if (await Dish.isNameTaken(dishBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Dish name already taken");
  }
  return Dish.create({ ...dishBody, images });
};

const queryDishes = async (filter, options) => {
  return Dish.paginate(filter, options);
};

const getDishById = async (id) => {
  const dish = await Dish.findById(id).populate("category").populate("restaurant");
  if (!dish) {
    throw new ApiError(httpStatus.NOT_FOUND, "Dish not found");
  }
  return dish;
};

const updateDishById = async (dishId, updateBody, files) => {
  const dish = await getDishById(dishId);
  // Nếu upload thêm ảnh, nối vào images
  if (files && files.length > 0) {
    const newImages = await fileService.saveMultiple(files, "dish");
    dish.images = dish.images.concat(newImages);
  }
  if (updateBody.name && (await Dish.isNameTaken(updateBody.name, dishId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Dish name already taken");
  }
  Object.assign(dish, updateBody);
  await dish.save();
  return dish;
};

const deleteDishById = async (dishId) => {
  const dish = await getDishById(dishId);
  await DishIngredient.deleteMany({ dish: dishId });
  await dish.deleteOne();
  return dish;
};

module.exports = {
  createDish,
  queryDishes,
  getDishById,
  updateDishById,
  deleteDishById,
};
