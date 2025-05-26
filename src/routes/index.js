const roleRouter = require("./roleRouter");
const authRouter = require("./authRouter");
const DishesRouter = require("./DishesRouter");
const restaurantController = require("./restaurantRouter");
const DishCateRouter = require("./DishCateRouter");
// const OrderRouter = require("./OrderRouter");
// const TableRouter = require("./TableRouter");

const routes = (app) => {
  app.use("/v1/api/role", roleRouter);
  app.use("/v1/api", authRouter);
  app.use("/v1/api/dish-category", DishCateRouter);
  app.use("/v1/api/restaurants", restaurantController);
  app.use("/v1/api", DishesRouter);
  // app.use("/v1/api/order", OrderRouter);
  // app.use("/v1/api/table", TableRouter);
};

module.exports = routes;
