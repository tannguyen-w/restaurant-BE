const Order = require("../models/Order");
const Table = require("../models/Table");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

/**
 * Tạo mới order
 * data: { customer, table, status, orderTime }
 */
const createOrder = async (data) => {
  // 1. Tạo order
  const order = await Order.create(data);

  return order;
};

const getOrdersByCustomer = async (customerId, options = {}) => {
  const filter = { customer: customerId };
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  // Truy vấn không qua paginate để đảm bảo sort đúng
  const docs = await Order.find(filter)
    .sort({ createdAt: -1 }) // Đảm bảo mới nhất đầu tiên
    .skip(skip)
    .limit(limit)
    .populate(options.populate || "");

  // Đếm tổng số document
  const totalDocs = await Order.countDocuments(filter);

  return {
    results: docs,
    page: page,
    limit: limit,
    totalPages: Math.ceil(totalDocs / limit),
    totalResults: totalDocs,
  };
};
const getOrders = async (filter = {}, options = {}) => {
  const paginateOptions = { ...options };
  const searchFilter = { ...filter };

  // Xử lý tìm kiếm chỉ theo fullName
  if (options.search && options.search.trim() !== "") {
    const searchTerm = options.search.trim();
    if (searchFilter.search) {
      delete searchFilter.search;
    }
    // Chỉ tìm kiếm theo fullName, không tìm kiếm theo các trường khác
    searchFilter.fullName = { $regex: searchTerm, $options: "i" };

    delete paginateOptions.search;
  }

  // Xử lý populate đặc biệt
  if (paginateOptions.populate && typeof paginateOptions.populate !== "string") {
    const populateValue = paginateOptions.populate;
    delete paginateOptions.populate;
    const result = await Order.paginate(searchFilter, paginateOptions);
    if (result.results && result.results.length > 0) {
      await Order.populate(result.results, populateValue);
    }
    return result;
  }

  return Order.paginate(searchFilter, paginateOptions);
};

const getOrderById = async (id, options = {}) => {
  let populateOptions = options.populate;

  // Không cần gọi split() nữa, kiểm tra kiểu dữ liệu để xử lý phù hợp
  if (populateOptions) {
    // Không làm gì nếu đã là mảng hoặc object
    // Nếu là string, thì có thể chuyển thành mảng nếu cần
    if (typeof populateOptions === "string") {
      populateOptions = populateOptions.split(" ");
      options.populate = populateOptions;
    }
  }

  const order = await Order.findById(id).populate(populateOptions);
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  return order;
};

const updateOrder = async (id, data) => {
  const order = await Order.findByIdAndUpdate(id, data, { new: true });
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  return order;
};

const deleteOrder = async (id) => {
  const order = await Order.findById(id);
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  await order.delete();
  return order;
};

const getOrdersByRestaurant = async (restaurantId, options = {}) => {
  // 1. Lấy tất cả các bàn thuộc nhà hàng này
  const tables = await Table.find({ restaurant: restaurantId });
  const tableIds = tables.map((table) => table._id);

  // 2. Lọc đơn hàng theo bàn đã tìm được
  const filter = { table: { $in: tableIds } };

  // 3. Thêm lọc theo orderType nếu có
  if (options.orderType) {
    filter.orderType = options.orderType;
  }

  // 4. Thêm lọc theo status nếu có
  if (options.status) {
    filter.status = options.status;
  }

  // 5. Tìm kiếm chỉ theo fullName
  if (options.search && options.search.trim() !== "") {
    const searchTerm = options.search.trim();

    // Chỉ tìm theo fullName
    filter.fullName = { $regex: searchTerm, $options: "i" };
  }

  // Xử lý populate
  if (options.populate && typeof options.populate !== "string") {
    const populateValue = options.populate;
    delete options.populate;
    const result = await Order.paginate(filter, options);
    if (result.results && result.results.length > 0) {
      await Order.populate(result.results, populateValue);
    }
    return result;
  }

  // 6. Phân trang và sort
  options.sort = options.sort || { createdAt: -1 };

  return Order.paginate(filter, options);
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByCustomer,
  getOrdersByRestaurant,
};
