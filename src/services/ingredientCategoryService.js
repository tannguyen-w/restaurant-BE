const IngredientCategory = require("../models/IngredientCategory");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

// Tạo mới IngredientCategory
const createIngredientCategory = async (data) => {
  const exist = await IngredientCategory.findOne({ name: data.name });
  if (exist) throw new ApiError(httpStatus.BAD_REQUEST, "Ingredient category name already exists");
  return IngredientCategory.create(data);
};

// Lấy danh sách IngredientCategory (có phân trang nếu có paginate)
const getIngredientCategories = async (filter = {}, options = {}, searchName = '') => {

  const queryFilter = { ...filter };
  
    // Thêm điều kiện tìm kiếm theo tên nếu có
    if (searchName && searchName.trim()) {
      queryFilter.name = { $regex: searchName.trim(), $options: 'i' };
    }
  
    // Sử dụng paginate nếu có
    if (IngredientCategory.paginate) {
      return IngredientCategory.paginate(queryFilter, options);
    }
    
    // Fallback nếu không có paginate plugin
    const query = IngredientCategory.find(queryFilter);
    
    // Xử lý sắp xếp
    if (options.sort) {
      query.sort(options.sort);
    }
    
    return query.exec();
};

// Lấy chi tiết một IngredientCategory
const getIngredientCategoryById = async (id) => {
  const category = await IngredientCategory.findById(id);
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, "Ingredient category not found");
  return category;
};

// Cập nhật IngredientCategory
const updateIngredientCategoryById = async (id, updateData) => {
  const category = await getIngredientCategoryById(id);
  Object.assign(category, updateData);
  await category.save();
  return category;
};

// Xóa IngredientCategory
const deleteIngredientCategoryById = async (id) => {
  const category = await getIngredientCategoryById(id);
  await category.deleteOne();
  return category;
};

module.exports = {
  createIngredientCategory,
  getIngredientCategories,
  getIngredientCategoryById,
  updateIngredientCategoryById,
  deleteIngredientCategoryById,
};
