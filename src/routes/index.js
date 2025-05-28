const roleRouter = require("./roleRouter");
const authRouter = require("./authRouter");
const DishesRouter = require("./DishesRouter");
const restaurantController = require("./restaurantRouter");
const DishCateRouter = require("./DishCateRouter");
const userRouter = require("./userRouter");
const supplierRoute = require("./supplierRoute");
const ingredientCategoryRoute = require("./ingredientCategoryRouter");

const routes = (app) => {
  app.use("/v1/api/role", roleRouter);
  app.use("/v1/api", authRouter);
  app.use("/v1/api/user", userRouter);
  app.use("/v1/api/dish-category", DishCateRouter);
  app.use("/v1/api/restaurants", restaurantController);
  app.use("/v1/api", DishesRouter);
  app.use("/v1/api/supplier", supplierRoute);
  app.use("/v1/api/ingredient-category", ingredientCategoryRoute);
};

module.exports = routes;
