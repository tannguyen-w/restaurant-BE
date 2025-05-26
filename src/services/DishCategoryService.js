const DishCategory = require("../models/DishCategory");

/**
 * Tạo mới danh mục món ăn
 */
exports.create = async (data) => {
  return DishCategory.create(data);
};

/**
 * Lấy danh sách danh mục, có phân trang
 */
exports.getAll = async ({ page = 1, limit = 20 }) => {
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
  };
  return DishCategory.paginate({}, options);
};

/**
 * Lấy chi tiết danh mục theo id
 */
exports.getById = async (id) => {
  if (!dish) {
    throw new ApiError(httpStatus.NOT_FOUND, "Dish not found");
  }
  return DishCategory.findById(id);
};

/**
 * Cập nhật danh mục món ăn
 */
exports.update = async (id, data) => {
  return DishCategory.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Soft delete danh mục
 */
exports.remove = async (id) => {
  return DishCategory.delete({ _id: id });
};
