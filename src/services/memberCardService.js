const MemberCard = require("../models/MemberCard");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

// Tạo mới
const createMemberCard = async (data) => {
  const existed = await MemberCard.findOne({ user: data.user });
  if (existed) throw new ApiError(httpStatus.BAD_REQUEST, "User already has a member card");
  return MemberCard.create(data);
};

// Lấy danh sách (phân trang)
const getMemberCards = async (filter = {}, options = {}) => {
  return MemberCard.paginate(filter, options);
};

// Lấy chi tiết
const getMemberCardById = async (id) => {
  const card = await MemberCard.findById(id).populate("user");
  if (!card) throw new ApiError(httpStatus.NOT_FOUND, "Member card not found");
  return card;
};

// Cập nhật
const updateMemberCard = async (id, data) => {
  const card = await MemberCard.findByIdAndUpdate(id, data, { new: true });
  if (!card) throw new ApiError(httpStatus.NOT_FOUND, "Member card not found");
  return card;
};

// Xóa
const deleteMemberCard = async (id) => {
  const card = await MemberCard.findById(id);
  if (!card) throw new ApiError(httpStatus.NOT_FOUND, "Member card not found");
  await card.delete();
  return card;
};

module.exports = {
  createMemberCard,
  getMemberCards,
  getMemberCardById,
  updateMemberCard,
  deleteMemberCard,
};
