const catchAsync = require("../utils/catchAsync");
const dishIngredientService = require("../services/dishIngredientService");

const createDishIngredient = catchAsync(async (req, res) => {
  const di = await dishIngredientService.createDishIngredient(req.body);
  res.status(201).send(di);
});

const getByDish = catchAsync(async (req, res) => {
  const items = await dishIngredientService.getByDish(req.params.dishId);
  res.status(202).send(items);
});

const getByIngredient = catchAsync(async (req, res) => {
  const items = await dishIngredientService.getByIngredient(req.params.ingredientId);
  res.status(202).send(items);
});

const getById = catchAsync(async (req, res) => {
  const item = await dishIngredientService.getById(req.params.id);
  res.status(202).send(item);
});

const updateDishIngredient = catchAsync(async (req, res) => {
  const item = await dishIngredientService.updateDishIngredient(req.params.id, req.body);
  res.status(201).send(item);
});

const deleteDishIngredient = catchAsync(async (req, res) => {
  await dishIngredientService.deleteDishIngredient(req.params.id);
  res.status(204).send();
});

module.exports = {
  createDishIngredient,
  getByDish,
  getByIngredient,
  getById,
  updateDishIngredient,
  deleteDishIngredient,
};
