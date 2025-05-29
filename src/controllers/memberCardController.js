const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const memberCardService = require("../services/memberCardService");

const createMemberCard = catchAsync(async (req, res) => {
  const card = await memberCardService.createMemberCard(req.body);
  res.status(201).send(card);
});

const getMemberCards = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, ...filter } = req.query;
  const options = { page: parseInt(page), limit: parseInt(limit), sort: { createdAt: -1 } };
  const result = await memberCardService.getMemberCards(filter, options);
  res.status(201).send(result);
});

const getMemberCardById = catchAsync(async (req, res) => {
  const card = await memberCardService.getMemberCardById(req.params.id);
  res.status(201).send(card);
});

const updateMemberCard = catchAsync(async (req, res) => {
  const card = await memberCardService.updateMemberCard(req.params.id, req.body);
  res.status(201).send(card);
});

const deleteMemberCard = catchAsync(async (req, res) => {
  await memberCardService.deleteMemberCard(req.params.id);
  res.status(204).send();
});

module.exports = {
  createMemberCard,
  getMemberCards,
  getMemberCardById,
  updateMemberCard,
  deleteMemberCard,
};
