const Order = require("../models/Order");
const User = require("../models/User");
const Table = require("../models/Table");
const Reservation = require("../models/Reservation");
const OrderDetail = require("../models/OrderDetail");
const Invoice = require("../models/Invoice");
const Role = require("../models/Role");
const moment = require("moment");

/**
 * Lấy thông tin thống kê tổng quan cho dashboard
 */
const getGeneralStats = async (restaurantId) => {
  // Lọc các bàn thuộc restaurant để sử dụng xuyên suốt
  let tables = [];
  let tableIds = [];
  if (restaurantId) {
    tables = await Table.find({ restaurant: restaurantId }).select("_id");
    tableIds = tables.map((table) => table._id);
  }

  // Lọc order theo restaurant (thông qua table)
  const orderFilter = restaurantId ? { table: { $in: tableIds } } : {};

  // Filter cho restaurant nếu được chỉ định
  const reservationFilter = restaurantId ? { restaurant: restaurantId } : {};

  // Để lọc hóa đơn theo nhà hàng, cần join với Order
  let invoiceFilter = {};
  if (restaurantId) {
    const orders = await Order.find(orderFilter).select("_id");
    const orderIds = orders.map((order) => order._id);
    invoiceFilter = { order: { $in: orderIds } };
  }

  // Lấy top 5 món ăn
  const topDishes = await getTopDishes(5, restaurantId);

  // Tính tổng doanh thu từ Invoice sử dụng final_amount (số tiền sau khi trừ discount)
  const totalRevenue = await Invoice.aggregate([
    {
      $match: {
        ...invoiceFilter,
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$final_amount" }, // Sử dụng final_amount thay vì totalAmount
      },
    },
  ]);

  // Tổng số khách hàng
  const customerRole = await Role.findOne({ name: "customer" });
  const totalCustomers = customerRole
    ? await User.countDocuments({ role: customerRole._id })
    : await User.countDocuments({ role: "customer" }); // Fallback nếu không dùng Role

  // Đơn hàng hôm nay
  const today = moment().startOf("day").toDate();
  const tomorrow = moment().endOf("day").toDate();

  const todayOrders = await Order.countDocuments({
    ...orderFilter,
    orderTime: { $gte: today, $lte: tomorrow },
  });

  // Đặt bàn đang hoạt động
  const activeReservations = await Reservation.countDocuments({
    ...reservationFilter,
    status: { $in: ["confirmed", "pending"] },
    reservation_time: { $gte: today },
  });

  // Thống kê trạng thái đơn hàng
  const orderStatusCount = await Order.aggregate([
    { $match: orderFilter },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Chuyển đổi kết quả aggregate sang định dạng frontend cần
  const orderStatusCounts = {
    pending: 0,
    preparing: 0,
    served: 0,
    finished: 0,
    cancelled: 0,
  };

  orderStatusCount.forEach((item) => {
    if (orderStatusCounts.hasOwnProperty(item._id)) {
      orderStatusCounts[item._id] = item.count;
    }
  });

  // Doanh thu theo ngày trong tuần từ Invoice
  const weekStart = moment().startOf("week").toDate();
  const weekEnd = moment().endOf("week").toDate();

  // Lấy doanh thu theo ngày từ hóa đơn
  const weeklyRevenue = await Invoice.aggregate([
    {
      $match: {
        ...invoiceFilter,
        payment_time: { $gte: weekStart, $lte: weekEnd }, // Sử dụng payment_time thay vì orderTime
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$payment_time" }, // Sử dụng payment_time
        revenue: { $sum: "$final_amount" }, // Sử dụng final_amount
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Chuyển đổi sang mảng 7 phần tử theo thứ tự thứ 2 -> CN
  const weeklyRevenueData = Array(7).fill(0);
  weeklyRevenue.forEach((item) => {
    // MongoDB $dayOfWeek trả về 1 cho Chủ nhật, 2 cho Thứ 2, ..., 7 cho Thứ 7
    // Chuyển sang thứ 2 -> CN (0 -> 6)
    const index = item._id === 1 ? 6 : item._id - 2;
    weeklyRevenueData[index] = item.revenue;
  });

  // Lấy danh sách đơn hàng gần đây
  const recentOrders = await Order.find(orderFilter)
    .sort({ orderTime: -1 })
    .limit(5)
    .populate("customer", "full_name")
    .populate("table", "name")
    .lean();

  const formattedRecentOrders = await Promise.all(
    recentOrders.map(async (order) => {
      // Lấy thông tin hóa đơn tương ứng để hiển thị số tiền
      const invoice = await Invoice.findOne({ order: order._id }).lean();

      return {
        id: order._id,
        customerName: order.fullName || (order.customer ? order.customer.full_name : "Khách vãng lai"),
        orderTime: order.orderTime,
        total: invoice ? invoice.final_amount : 0,
        status: order.status,
        tableName: order.table ? order.table.name : "Online",
      };
    })
  );

  // Lấy đặt bàn sắp tới
  const upcomingReservations = await Reservation.find({
    ...reservationFilter,
    reservation_time: { $gte: today },
    status: { $in: ["confirmed", "pending"] },
  })
    .sort({ reservation_time: 1 })
    .limit(5)
    .populate("customer", "full_name")
    .populate("table", "name")
    .lean();

  const formattedReservations = upcomingReservations.map((res) => {
    // Format ngày đặt bàn theo dạng DD/MM/YYYY
    const formattedDate = moment(res.reservation_time).format("DD/MM/YYYY");

    // Kết hợp ngày đặt và time_slot
    const displayTime = res.timeSlot ? `${formattedDate} - ${res.timeSlot}` : formattedDate;
    return {
      id: res._id,
      customerName: res.customer ? res.customer.full_name : "Khách vãng lai",
      tableName: res.table ? res.table.name : `Bàn ${res.tableId || "?"}`,
      reservationTime: displayTime,
      reservationDate: res.reservation_time,
      guestCount: res.number_of_people || 2,
      status: res.status,
      phone: res.phone || "",
    };
  });

  // Trả về đối tượng với cấu trúc như frontend cần
  return {
    totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    todayOrders,
    activeReservations,
    totalCustomers,
    orderStatusCount: orderStatusCounts,
    weeklyRevenue: weeklyRevenueData,
    recentOrders: formattedRecentOrders,
    upcomingReservations: formattedReservations,
    topDishes,
  };
};

/**
 * Lấy thống kê doanh thu theo thời gian
 */
const getSalesStats = async (period = "monthly", startDate, endDate, restaurantId) => {
  // Để lọc hóa đơn theo nhà hàng, cần join với Order
  let invoiceFilter = {};
  if (restaurantId) {
    const orders = await Order.find({
      table: { $in: await Table.find({ restaurant: restaurantId }).select("_id") },
    }).select("_id");
    const orderIds = orders.map((order) => order._id);
    invoiceFilter = { order: { $in: orderIds } };
  }

  // Xác định khoảng thời gian
  let timeFilter = {};
  if (startDate && endDate) {
    timeFilter = {
      payment_time: {
        // Sử dụng payment_time thay vì orderTime
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };
  } else {
    // Mặc định lấy dữ liệu của 12 tháng gần nhất
    const defaultEndDate = new Date();
    let defaultStartDate;

    switch (period) {
      case "daily":
        defaultStartDate = moment().subtract(30, "days").toDate();
        break;
      case "weekly":
        defaultStartDate = moment().subtract(12, "weeks").toDate();
        break;
      case "monthly":
      default:
        defaultStartDate = moment().subtract(12, "months").toDate();
        break;
    }

    timeFilter = {
      payment_time: {
        $gte: defaultStartDate,
        $lte: defaultEndDate,
      },
    };
  }

  // Định dạng nhóm theo period
  let groupBy = {};
  let dateFormat = "";

  switch (period) {
    case "daily":
      groupBy = {
        year: { $year: "$payment_time" },
        month: { $month: "$payment_time" },
        day: { $dayOfMonth: "$payment_time" },
      };
      dateFormat = "%Y-%m-%d";
      break;
    case "weekly":
      groupBy = {
        year: { $year: "$payment_time" },
        week: { $week: "$payment_time" },
      };
      dateFormat = "%Y-W%U";
      break;
    case "monthly":
    default:
      groupBy = {
        year: { $year: "$payment_time" },
        month: { $month: "$payment_time" },
      };
      dateFormat = "%Y-%m";
      break;
  }

  const salesData = await Invoice.aggregate([
    {
      $match: {
        ...timeFilter,
        ...invoiceFilter,
      },
    },
    {
      $group: {
        _id: groupBy,
        totalSales: { $sum: "$final_amount" }, // Sử dụng final_amount
        orderCount: { $sum: 1 },
        date: {
          $first: {
            $dateToString: {
              format: dateFormat,
              date: "$payment_time",
            },
          },
        },
      },
    },
    { $sort: { date: 1 } },
  ]);

  return {
    period,
    data: salesData.map((item) => ({
      date: item.date,
      totalSales: item.totalSales,
      orderCount: item.orderCount,
    })),
  };
};

/**
 * Lấy thống kê đơn hàng
 */
const getOrderStats = async (period = "weekly", startDate, endDate, restaurantId) => {
  // Filter theo nhà hàng
  const restaurantFilter = restaurantId ? { restaurant: restaurantId } : {};

  // Logic tương tự như getSalesStats nhưng phân theo trạng thái
  let timeFilter = {};
  if (startDate && endDate) {
    timeFilter = {
      orderTime: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };
  } else {
    const defaultEndDate = new Date();
    let defaultStartDate;

    switch (period) {
      case "daily":
        defaultStartDate = moment().subtract(30, "days").toDate();
        break;
      case "weekly":
        defaultStartDate = moment().subtract(12, "weeks").toDate();
        break;
      case "monthly":
      default:
        defaultStartDate = moment().subtract(12, "months").toDate();
        break;
    }

    timeFilter = {
      orderTime: {
        $gte: defaultStartDate,
        $lte: defaultEndDate,
      },
    };
  }

  // Định dạng nhóm theo period
  let groupBy = {};
  let dateFormat = "";

  switch (period) {
    case "daily":
      groupBy = {
        year: { $year: "$orderTime" },
        month: { $month: "$orderTime" },
        day: { $dayOfMonth: "$orderTime" },
      };
      dateFormat = "%Y-%m-%d";
      break;
    case "weekly":
      groupBy = {
        year: { $year: "$orderTime" },
        week: { $week: "$orderTime" },
      };
      dateFormat = "%Y-W%U";
      break;
    case "monthly":
    default:
      groupBy = {
        year: { $year: "$orderTime" },
        month: { $month: "$orderTime" },
      };
      dateFormat = "%Y-%m";
      break;
  }

  // Tính số lượng đơn theo trạng thái và thời gian
  const orderData = await Order.aggregate([
    {
      $match: {
        ...timeFilter,
        ...restaurantFilter,
      },
    },
    {
      $group: {
        _id: {
          timePeriod: groupBy,
          status: "$status",
          date: {
            $dateToString: {
              format: dateFormat,
              date: "$orderTime",
            },
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);

  // Chuyển đổi kết quả về định dạng frontend cần
  const formattedData = [];
  const dateMap = new Map();

  // Tạo đối tượng cho mỗi ngày với số lượng mặc định là 0 cho các trạng thái
  orderData.forEach((item) => {
    const date = item._id.date;
    const status = item._id.status;
    const count = item.count;

    if (!dateMap.has(date)) {
      dateMap.set(date, {
        date,
        pending: 0,
        preparing: 0,
        served: 0,
        finished: 0,
        cancelled: 0,
      });
    }

    const dateEntry = dateMap.get(date);
    if (dateEntry.hasOwnProperty(status)) {
      dateEntry[status] = count;
    }
  });

  // Chuyển map thành mảng kết quả
  dateMap.forEach((value) => {
    formattedData.push(value);
  });

  return {
    period,
    data: formattedData,
  };
};

/**
 * Lấy thống kê đặt bàn
 */
const getReservationStats = async (period = "daily", startDate, endDate, restaurantId) => {
  const restaurantFilter = restaurantId ? { restaurant: restaurantId } : {};
  // Lấy bàn thuộc restaurant nếu có filter
  let tableFilter = {};
  if (restaurantId) {
    const tables = await Table.find({ restaurant: restaurantId }).select("_id");
    const tableIds = tables.map((table) => table._id);
    tableFilter = { table: { $in: tableIds } };
  }

  // Xác định khoảng thời gian
  let timeFilter = {};
  if (startDate && endDate) {
    timeFilter = {
      reservation_time: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };
  } else {
    const defaultEndDate = new Date();
    let defaultStartDate;

    switch (period) {
      case "daily":
        defaultStartDate = moment().subtract(30, "days").toDate();
        break;
      case "weekly":
        defaultStartDate = moment().subtract(12, "weeks").toDate();
        break;
      case "monthly":
      default:
        defaultStartDate = moment().subtract(12, "months").toDate();
        break;
    }

    timeFilter = {
      reservation_time: {
        $gte: defaultStartDate,
        $lte: defaultEndDate,
      },
    };
  }

  // Định dạng nhóm theo period
  let groupBy = {};
  let dateFormat = "";

  switch (period) {
    case "daily":
      groupBy = {
        year: { $year: "$reservation_time" },
        month: { $month: "$reservation_time" },
        day: { $dayOfMonth: "$reservation_time" },
      };
      dateFormat = "%Y-%m-%d";
      break;
    case "weekly":
      groupBy = {
        year: { $year: "$reservation_time" },
        week: { $week: "$reservation_time" },
      };
      dateFormat = "%Y-W%U";
      break;
    case "monthly":
    default:
      groupBy = {
        year: { $year: "$reservation_time" },
        month: { $month: "$reservation_time" },
      };
      dateFormat = "%Y-%m";
      break;
  }

  const reservationData = await Reservation.aggregate([
    {
      $match: {
        ...timeFilter,
        ...restaurantFilter,
      },
    },
    {
      $group: {
        _id: {
          timePeriod: groupBy,
          status: "$status",
          date: {
            $dateToString: {
              format: dateFormat,
              date: "$reservation_time",
            },
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);

  // Chuyển đổi kết quả về định dạng frontend cần
  const formattedData = [];
  const dateMap = new Map();

  // Tạo đối tượng cho mỗi ngày với số lượng mặc định là 0 cho các trạng thái
  reservationData.forEach((item) => {
    const date = item._id.date;
    const status = item._id.status;
    const count = item.count;

    if (!dateMap.has(date)) {
      dateMap.set(date, {
        date,
        pending: 0,
        confirmed: 0,
        cancelled: 0,
        completed: 0,
      });
    }

    const dateEntry = dateMap.get(date);
    if (dateEntry.hasOwnProperty(status)) {
      dateEntry[status] = count;
    }
  });

  // Chuyển map thành mảng kết quả
  dateMap.forEach((value) => {
    formattedData.push(value);
  });

  return {
    period,
    data: formattedData,
  };
};

/**
 * Lấy danh sách món ăn bán chạy nhất
 */
const getTopDishes = async (limit = 10, restaurantId) => {
  // Filter theo restaurant nếu có
  let orderFilter = {};
  if (restaurantId) {
    const tables = await Table.find({ restaurant: restaurantId }).select("_id");
    const tableIds = tables.map((table) => table._id);
    orderFilter = { table: { $in: tableIds } };
  }

  // Chỉ lấy những đơn hàng đã được phục vụ hoặc hoàn thành
  // Vì các món trong đơn này đã chắc chắn được phục vụ cho khách
  orderFilter.status = { $in: ["served", "finished"] };

  // Lấy danh sách order theo filter
  const orders = await Order.find(orderFilter).select("_id");
  const orderIds = orders.map((order) => order._id);

  // Nếu không có đơn hàng nào thỏa điều kiện, trả về mảng rỗng
  if (orderIds.length === 0) {
    return [];
  }

  // Aggregate để lấy top món ăn
  const topDishes = await OrderDetail.aggregate([
    {
      $match: {
        order: { $in: orderIds },
      },
    },
    {
      $group: {
        _id: "$dish", // Sử dụng dish thay vì menuItem
        count: { $sum: "$quantity" },
        revenue: { $sum: { $multiply: ["$price", "$quantity"] } },
      },
    },
    {
      $lookup: {
        from: "dishes", // Đảm bảo collection name là dishes
        localField: "_id",
        foreignField: "_id",
        as: "dishInfo",
      },
    },
    {
      $match: { dishInfo: { $ne: [] } }, // Loại bỏ các món không có thông tin
    },
    { $unwind: "$dishInfo" },
    {
      $project: {
        _id: 0,
        name: "$dishInfo.name",
        count: 1,
        revenue: 1,
        category: "$dishInfo.category",
        imageUrl: "$dishInfo.image",
      },
    },
    { $sort: { count: -1 } },
    { $limit: parseInt(limit) },
  ]);

  return topDishes;
};

/**
 * Lấy hoạt động người dùng
 */
const getUserActivity = async (days = 30, restaurantId) => {
  const startDate = moment().subtract(parseInt(days), "days").toDate();

  // Filter theo restaurant nếu có
  let orderFilter = {};
  if (restaurantId) {
    const tables = await Table.find({ restaurant: restaurantId }).select("_id");
    const tableIds = tables.map((table) => table._id);
    orderFilter = { table: { $in: tableIds } };
  }

  // Hoạt động đặt hàng
  const orderActivity = await Order.aggregate([
    {
      $match: {
        ...orderFilter,
        orderTime: { $gte: startDate },
      },
    },
    {
      $lookup: {
        from: "invoices",
        localField: "_id",
        foreignField: "order",
        as: "invoiceInfo",
      },
    },
    {
      $group: {
        _id: "$customer",
        orderCount: { $sum: 1 },
        totalSpent: {
          $sum: {
            $ifNull: [{ $arrayElemAt: ["$invoiceInfo.final_amount", 0] }, 0],
          },
        },
        lastOrderDate: { $max: "$orderTime" },
      },
    },
    { $sort: { orderCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        fullName: { $arrayElemAt: ["$userInfo.full_name", 0] },
        email: { $arrayElemAt: ["$userInfo.email", 0] },
        phone: { $arrayElemAt: ["$userInfo.phone", 0] },
        orderCount: 1,
        totalSpent: 1,
        lastOrderDate: 1,
      },
    },
  ]);

  return {
    days,
    userActivity: orderActivity,
  };
};

module.exports = {
  getGeneralStats,
  getSalesStats,
  getOrderStats,
  getReservationStats,
  getTopDishes,
  getUserActivity,
};
