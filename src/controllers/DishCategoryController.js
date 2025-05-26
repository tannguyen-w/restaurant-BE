const DishCategoryService = require("../services/DishCategoryService");

/**
 * Tạo mới danh mục món ăn
 */
exports.create = async (req, res) => {
  try {
    const category = await DishCategoryService.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Lấy danh sách danh mục món ăn (có phân trang)
 */
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await DishCategoryService.getAll({ page, limit });
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Lấy chi tiết 1 danh mục món ăn theo id
 */
exports.getById = async (req, res) => {
  try {
    const category = await DishCategoryService.getById(req.params.id);
    console.log("Check", req.params);

    if (!category) return res.status(404).json({ message: "Not found" });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Cập nhật danh mục món ăn
 */
exports.update = async (req, res) => {
  try {
    const updated = await DishCategoryService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Xóa mềm danh mục (soft delete)
 */
exports.remove = async (req, res) => {
  try {
    const deleted = await DishCategoryService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
