const Dish = require("../models/Dish");
const DishIngredient = require("../models/DishIngredient");

const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const createDish = async (dishBody) => {
  if (await Dish.isNameTaken(dishBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Dish name already taken");
  }
  return Dish.create(dishBody);
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

const updateDishById = async (dishId, updateBody) => {
  const dish = await getDishById(dishId);
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
  await dish.remove();
};

module.exports = {
  createDish,
  queryDishes,
  getDishById,
  updateDishById,
  deleteDishById,
};
