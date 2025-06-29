const express = require("express");
const { auth, authorize } = require("../middlewares/auth");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

const ALLOW_ROLE = ["manager", "admin"];

router.get("/stats", auth, authorize(...ALLOW_ROLE), dashboardController.getGeneralStats);
router.get("/sales", auth, authorize(...ALLOW_ROLE), dashboardController.getSalesStats);
router.get("/orders", auth, authorize(...ALLOW_ROLE), dashboardController.getOrderStats);
router.get("/reservations", auth, authorize(...ALLOW_ROLE), dashboardController.getReservationStats);
router.get("/top-dishes", auth, authorize(...ALLOW_ROLE), dashboardController.getTopDishes);
router.get("/user-activity", auth, authorize(...ALLOW_ROLE), dashboardController.getUserActivity);

module.exports = router;
