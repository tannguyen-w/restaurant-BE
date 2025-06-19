const ingredientService = require("../services/ingredientService");

// Tạo mới
const createIngredient = async (req, res, next) => {
  try {
    const ingredient = await ingredientService.createIngredient(req.body);
    res.status(201).json(ingredient);
  } catch (err) {
    next(err);
  }
};

// Lấy danh sách
const getIngredients = async (req, res, next) => {
  try {
    const { page, limit, ...filter } = req.query;
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      populate: "category"
    };

    const searchName = req.query.name || '';
    
    const result = await ingredientService.getIngredients(filter, options, searchName);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Lấy chi tiết
const getIngredient = async (req, res, next) => {
  try {
    const ingredient = await ingredientService.getIngredientById(req.params.id);
    res.json(ingredient);
  } catch (err) {
    next(err);
  }
};

// Cập nhật
const updateIngredient = async (req, res, next) => {
  try {
    const ingredient = await ingredientService.updateIngredientById(req.params.id, req.body);
    res.json(ingredient);
  } catch (err) {
    next(err);
  }
};

// Xóa
const deleteIngredient = async (req, res, next) => {
  try {
    await ingredientService.deleteIngredientById(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createIngredient,
  getIngredients,
  getIngredient,
  updateIngredient,
  deleteIngredient,
};
