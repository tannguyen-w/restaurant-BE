const catchAsync = require("../utils/catchAsync");
const dishService = require("../services/dishService");
const fileService = require("../services/fileService");


// Tạo mới dish (hỗ trợ upload nhiều ảnh)
const createDish = catchAsync(async (req, res) => {
  const dishData = req.body;
  const files = req.files;
  const dish = await dishService.createDish(dishData, files);
  res.status(201).json(dish);
});

// Lấy danh sách dish
const getDishes = catchAsync(async (req, res, next) => {

   try {
      const { page, limit, ...filter } = req.query;
      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        populate: "restaurant category",
        sort: req.query.sort || { createdAt: -1 }
      };

      const searchName = req.query.name || '';
      
       const result = await dishService.queryDishes(filter, options, searchName);
      res.json(result);
    } catch (err) {
      next(err);
    }
});

// Lấy chi tiết dish
const getDish = catchAsync(async (req, res, next) => {
  try {
    const dish = await dishService.getDishById(req.params.dishId);
    res.json(dish);
  } catch (err) {
    next(err);
  }
});

// Cập nhật dish (có thể upload thêm ảnh)
const updateDish = catchAsync(async (req, res, next) => {
  // Lấy thông tin từ body request
  const updateBody = { ...req.body };
  
  // Xử lý trường hợp category null hoặc undefined
  if (updateBody.category === "null" || updateBody.category === "") {
    delete updateBody.category;
  }
  
  // Xử lý trường hợp restaurant null hoặc undefined
  if (updateBody.restaurant === "null" || updateBody.restaurant === "") {
    delete updateBody.restaurant;
  }
  
  // Xử lý giá trị boolean
  if (updateBody.isCombo !== undefined) {
    updateBody.isCombo = updateBody.isCombo === "true" || updateBody.isCombo === true;
  }
  
  // Gọi service để cập nhật món ăn với hình ảnh mới (nếu có)
  const updatedDish = await dishService.updateDish(
    req.params.dishId, 
    updateBody, 
    req.files // Mảng các file hình ảnh được upload bởi multer middleware
  );
  
  res.json(updatedDish);
});

// Xóa dish
const deleteDish = catchAsync(async (req, res) => {
  await dishService.deleteDishById(req.params.dishId);
  res.status(204).send();
});

const getDishesByRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
      populate: req.query.populate || "category",
      categoryId: req.query.categoryId,
      name: req.query.name,
    };

    const result = await dishService.getDishesByRestaurant(restaurantId, options);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDish,
  getDishes,
  getDish,
  updateDish,
  deleteDish,
  getDishesByRestaurant,
};
