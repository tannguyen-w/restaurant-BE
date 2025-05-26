// const UserRouter = require("./UserRouter");
const DishesRouter = require("./DishesRouter");
const DishCateRouter = require("./DishCateRouter");
// const OrderRouter = require("./OrderRouter");
// const TableRouter = require("./TableRouter");

const routes = (app) => {
  // app.use("/v1/api/user", UserRouter);
  app.use("/v1/api", DishesRouter);
  app.use("/v1/api", DishCateRouter);
  // app.use("/v1/api/order", OrderRouter);
  // app.use("/v1/api/table", TableRouter);
};

module.exports = routes;
