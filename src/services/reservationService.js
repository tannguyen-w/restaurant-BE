const Reservation = require("../models/Reservation");
const Table = require("../models/Table");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const checkTableReservation = async (tableId, reservationTime, timeSlot) => {
  // Kiểm tra bàn tồn tại
  const table = await Table.findById(tableId);
  if (!table) {
    return {
      available: false,
      message: "Không tìm thấy bàn",
    };
  }

  // Kiểm tra bàn có đang bảo trì
  if (table.status === "maintenance") {
    return {
      available: false,
      message: "Bàn đang trong tình trạng bảo trì",
    };
  }

  try {
    // Kiểm tra reservation trùng thời gian
    const existingReservation = await Reservation.findOne({
      table: tableId,
      reservation_time: reservationTime,
      timeSlot: timeSlot,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingReservation) {
      return {
        success: true,
        available: false,
        message: "Bàn đã có người đặt vào thời gian này",
      };
    }

    return {
      success: true,
      available: true,
      message: "Bàn còn trống và có thể đặt",
      table: table,
    };
  } catch (error) {
    return {
      success: false,
      available: false,
      message: "Lỗi khi kiểm tra bàn: " + error.message,
    };
  }
};

// Tạo mới
const createReservation = async (reservationData) => {
  // Kiểm tra bàn đã được đặt chưa
  const isTableAvailable = await checkTableReservation(
    reservationData.table,
    reservationData.reservation_time,
    reservationData.timeSlot
  );

  if (!isTableAvailable.available) {
    throw new ApiError(httpStatus.CONFLICT, isTableAvailable.message || "Bàn đã có người đặt vào thời gian này");
  }

  return Reservation.create(reservationData);
};

// Lấy danh sách (có phân trang)
const getReservations = async (filter = {}, options = {}) => {
  // Xử lý tìm kiếm
  if (options.search && options.search.trim() !== "") {
    const searchTerm = options.search.trim();

    // Khởi tạo mảng điều kiện $or nếu chưa có
    filter.$or = filter.$or || [];

    // Thêm điều kiện tìm theo số điện thoại
    filter.$or.push({ phone: { $regex: searchTerm, $options: "i" } });

    // Tìm kiếm theo tên khách hàng nếu cần
    if (options.searchByCustomer) {
      const User = require("../models/User");
      const matchingUsers = await User.find({
        fullName: { $regex: searchTerm, $options: "i" },
      }).select("_id");

      const userIds = matchingUsers.map((user) => user._id);

      if (userIds.length > 0) {
        filter.$or.push({ customer: { $in: userIds } });
      }
    }

    // Nếu không có điều kiện tìm kiếm nào khớp
    if (filter.$or.length === 0) {
      delete filter.$or;
    }
  }

  return Reservation.paginate(filter, options);
};

// Lấy chi tiết
const getReservationById = async (id) => {
  const reservation = await Reservation.findById(id).populate("customer").populate("table");
  if (!reservation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Không tìm thấy thông tin đặt bàn");
  }
  return reservation;
};

// Cập nhật
const updateReservation = async (id, updateData) => {
  // Lấy thông tin reservation hiện tại để kiểm tra
  const currentReservation = await Reservation.findById(id);

  if (!currentReservation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Không tìm thấy thông tin đặt bàn");
  }

  // Nếu cập nhật table, reservation_time hoặc timeSlot, cần kiểm tra tính khả dụng
  if (
    (updateData.table && updateData.table.toString() !== currentReservation.table.toString()) ||
    (updateData.reservation_time &&
      updateData.reservation_time.toString() !== currentReservation.reservation_time.toString()) ||
    (updateData.timeSlot && updateData.timeSlot !== currentReservation.timeSlot)
  ) {
    const tableId = updateData.table || currentReservation.table;
    const reservationTime = updateData.reservation_time || currentReservation.reservation_time;
    const timeSlot = updateData.timeSlot || currentReservation.timeSlot;

    const tableAvailability = await checkTableReservation(tableId, reservationTime, timeSlot);
    if (!tableAvailability.available) {
      throw new ApiError(httpStatus.CONFLICT, tableAvailability.message);
    }
  }

  // Sử dụng findByIdAndUpdate thay vì Object.assign + save
  const updatedReservation = await Reservation.findByIdAndUpdate(
    id,
    { $set: updateData },
    {
      new: true, // Trả về document sau khi cập nhật
      runValidators: true, // Đảm bảo chạy các validators của schema
    }
  )
    .populate("customer")
    .populate("table");

  if (!updatedReservation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cập nhật không thành công");
  }

  return updatedReservation;
};

// Xóa
const deleteReservation = async (id) => {
  const reservation = await Reservation.findById(id);
  if (!reservation) throw new ApiError(httpStatus.NOT_FOUND, "Reservation not found");
  await reservation.delete();
  return reservation;
};

const getMyReservations = async (customerId, options = {}) => {
  const filter = { customer: customerId };

  // Đảm bảo chúng ta populate các trường liên quan
  if (!options.populate) {
    options.populate = "table";
    options.populate = "restaurant";
  }

  // Sắp xếp theo thời gian đặt bàn mới nhất nếu không chỉ định
  if (!options.sort) {
    options.sort = { reservation_time: -1 };
  }

  return Reservation.paginate(filter, options);
};

// Lấy tất cả đặt bàn thuộc một nhà hàng
const getReservationsByRestaurant = async (restaurantId, options = {}) => {
  const filter = { restaurant: restaurantId };

  if (options.status) {
    filter.status = options.status;
  }

  if (!options.populate) {
    options.populate = "table,customer";
  }

  if (options.search && options.search.trim() !== "") {
    // Tìm kiếm theo số điện thoại
    if (options.search && options.search.trim() !== "") {
      const searchTerm = options.search.trim();

      // Tìm kiếm theo số điện thoại trong bảng Reservation
      filter.$or = [{ phone: { $regex: searchTerm, $options: "i" } }];

      // Nếu cần tìm kiếm theo tên người dùng, cần dùng aggregate
      if (options.searchByCustomer) {
        // Lưu lại filter ban đầu trước khi search
        const baseFilter = { ...filter };
        delete baseFilter.$or;

        // Tìm tất cả customer có tên phù hợp
        const User = require("../models/User");
        const matchingUsers = await User.find({
          fullName: { $regex: searchTerm, $options: "i" },
        }).select("_id");

        // Lấy danh sách ID người dùng phù hợp
        const userIds = matchingUsers.map((user) => user._id);

        if (userIds.length > 0) {
          // Thêm điều kiện tìm theo ID người dùng
          filter.$or = filter.$or || [];
          filter.$or.push({ customer: { $in: userIds } });
        }
      }
    }
  }

  if (!options.sort) {
    options.sort = { reservation_time: -1 };
  }

  return Reservation.paginate(filter, options);
};

//
const updateReservationStatus = async (id, status) => {
  if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Trạng thái không hợp lệ");
  }

  // Sử dụng findByIdAndUpdate thay vì save
  const reservation = await Reservation.findByIdAndUpdate(
    id,
    { status },
    { new: true } // Trả về document đã cập nhật
  )
    .populate("customer")
    .populate("table");

  if (!reservation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Không tìm thấy thông tin đặt bàn");
  }

  return reservation;
};

module.exports = {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  getMyReservations,
  checkTableReservation,
  getReservationsByRestaurant,
  updateReservationStatus,
};
