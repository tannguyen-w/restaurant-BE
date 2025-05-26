const Restaurant = require("../models/Restaurant");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const createRestaurant = async (body) => {
  return Restaurant.create(body);
};

const queryRestaurants = async (filter, options) => {
  return Restaurant.paginate(filter, options);
};

const getRestaurantById = async (id) => {
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) throw new ApiError(httpStatus.NOT_FOUND, "Restaurant not found");
  return restaurant;
};

const updateRestaurantById = async (restaurantId, updateBody) => {
  const restaurant = await getRestaurantById(restaurantId);
  Object.assign(restaurant, updateBody);
  await restaurant.save();
  return restaurant;
};

const deleteRestaurantById = async (restaurantId) => {
  const restaurant = await getRestaurantById(restaurantId);
  await restaurant.delete();
  return restaurant;
};

module.exports = {
  createRestaurant,
  queryRestaurants,
  getRestaurantById,
  updateRestaurantById,
  deleteRestaurantById,
};
