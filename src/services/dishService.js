const Dish = require("../models/Dish");
const DishIngredient = require("../models/DishIngredient");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const fileService = require("./fileService");
const path = require("path");
const fs = require("fs");


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

const queryDishes = async (filter = {}, options = {}, searchName = '') => {
  // Tạo filter mới để không ảnh hưởng đến tham số gốc
  const queryFilter = { ...filter };

  // Thêm điều kiện tìm kiếm theo tên nếu có
  if (searchName && searchName.trim()) {
    queryFilter.name = { $regex: searchName.trim(), $options: 'i' };
  }

  // Đảm bảo populate cả restaurant và category
  if (!options.populate) {
    options.populate = ['restaurant', 'category'];
  }
  
  // Sử dụng paginate nếu có
  if (Dish.paginate) {
    return Dish.paginate(queryFilter, options);
  }
  
  // Fallback nếu không có paginate plugin
  const query = Dish.find(queryFilter);
  
  // Xử lý populate
  if (options.populate) {
    if (Array.isArray(options.populate)) {
      options.populate.forEach(path => {
        query.populate(path);
      });
    } else {
      query.populate(options.populate);
    }
  }
  
  // Xử lý sắp xếp
  if (options.sort) {
    query.sort(options.sort);
  }
  
  return query.exec();
};

const getDishById = async (id) => {
  const dish = await Dish.findById(id).populate("category").populate("restaurant");
  if (!dish) {
    throw new ApiError(httpStatus.NOT_FOUND, "Dish not found");
  }
  return dish;
};

const updateDish = async (dishId, updateBody, files) => {
  const dish = await Dish.findById(dishId);
  if (!dish) {
    throw new ApiError(httpStatus.NOT_FOUND, "Không tìm thấy món ăn");
  }

  // Xử lý hình ảnh
  let updatedImages = [];
  
  // 1. Xử lý hình ảnh cũ nếu có
  if (updateBody.images) {
    try {
      // Parse chuỗi JSON thành mảng, nếu là chuỗi
      const keepImages = typeof updateBody.images === "string" 
        ? JSON.parse(updateBody.images)
        : updateBody.images;
      
      // Thêm các hình ảnh cũ vào danh sách cập nhật
      if (Array.isArray(keepImages)) {
        updatedImages = [...keepImages];
      }
    } catch (error) {
      console.error("Lỗi xử lý danh sách ảnh cũ:", error);
      // Nếu có lỗi, giữ nguyên danh sách ảnh cũ
      updatedImages = dish.images || [];
    }
  } else {
    // Nếu không có thông tin về ảnh cũ, giữ nguyên
    updatedImages = dish.images || [];
  }
  
  // 2. Xử lý hình ảnh mới được upload
  if (files && Array.isArray(files) && files.length > 0) {
    const newImagePaths = await fileService.saveMultiple(files, "dish");
    updatedImages = [...updatedImages, ...newImagePaths];
  }

  // 3. Xóa các file ảnh không còn được sử dụng nữa
  const oldImages = dish.images || [];
  const removedImages = oldImages.filter(img => !updatedImages.includes(img));
  
  // Xóa các file ảnh cũ không còn được sử dụng
  if (removedImages.length > 0) {
    removedImages.forEach(imgPath => {
      try {
        const fullPath = path.join(__dirname, "../public", imgPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (error) {
        console.error(`Không thể xóa file ${imgPath}:`, error);
      }
    });
  }
  
  // Cập nhật thông tin món ăn, bao gồm cả danh sách hình ảnh mới
  Object.assign(updateBody, { images: updatedImages });
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

const getDishesByRestaurant = async (restaurantId, options = {}) => {
  const filter = { restaurant: restaurantId };

  // Thêm lọc theo category nếu có
  if (options.categoryId) {
    filter.category = options.categoryId;
  }

  // Thêm tìm kiếm theo tên nếu có
  if (options.name) {
    filter.name = { $regex: options.name, $options: "i" };
  }

  // Sắp xếp mặc định theo tên
  options.sort = options.sort || { name: 1 };

  return Dish.paginate(filter, options);
};

module.exports = {
  createDish,
  queryDishes,
  getDishById,
  updateDish,
  deleteDishById,
  getDishesByRestaurant,
};
