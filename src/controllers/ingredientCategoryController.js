const ingredientCategoryService = require("../services/ingredientCategoryService");

// Tạo mới
const createIngredientCategory = async (req, res, next) => {
  try {
    const category = await ingredientCategoryService.createIngredientCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

// Lấy danh sách
const getIngredientCategories = async (req, res, next) => {
  try {
    const { page, limit, ...filter } = req.query;
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    };
    
    const searchName = req.query.name || '';

    const result = await ingredientCategoryService.getIngredientCategories(filter, options, searchName);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Lấy chi tiết
const getIngredientCategory = async (req, res, next) => {
  try {
    const category = await ingredientCategoryService.getIngredientCategoryById(req.params.id);
    res.json(category);
  } catch (err) {
    next(err);
  }
};

// Cập nhật
const updateIngredientCategory = async (req, res, next) => {
  try {
    const category = await ingredientCategoryService.updateIngredientCategoryById(req.params.id, req.body);
    res.json(category);
  } catch (err) {
    next(err);
  }
};

// Xóa
const deleteIngredientCategory = async (req, res, next) => {
  try {
    await ingredientCategoryService.deleteIngredientCategoryById(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createIngredientCategory,
  getIngredientCategories,
  getIngredientCategory,
  updateIngredientCategory,
  deleteIngredientCategory,
};
