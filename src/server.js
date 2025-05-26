require("dotenv").config();

const express = require("express");
const cors = require("cors");
const httpStatus = require("http-status");
const fileUpload = require("express-fileupload");

const configViewEngine = require("./config/viewEngine");
const routes = require("./routes/index");

const connection = require("./config/database");
const seedDB = require("./seeder/seed");
const morgan = require("./config/morgan");
const { errorConverter, errorHandler } = require("./middleware/error");
const ApiError = require("./utils/ApiError");

const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

app.use(cors());
// config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
    abortOnLimit: true,
    responseOnLimit: "File size exceeds the limit",
  })
);

// Logging requests trong môi trường development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// config engine template
configViewEngine(app);

// API routes
routes(app);

// Xử lý khi không tìm thấy route
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// Xử lý lỗi
app.use(errorConverter);
app.use(errorHandler);

(async () => {
  // Test connection
  try {
    await connection();
    await seedDB();

    app.listen(port, hostname, () => {
      console.log(`Backend app listening on port ${port}`);
    });
  } catch (error) {
    console.log("Error connect to DB", error);
  }
})();
