const express = require("express");
const jwtAuthMiddleware = require("../middleware/jwtAuth.middleware");
const adminOnlyMiddleware = require("../middleware/admin.middleware");
const { getUsageAnalytics } = require("../controllers/analytics.controller");

const router = express.Router();

router.get(
  "/usage",
  jwtAuthMiddleware,      // is user logged in?
  adminOnlyMiddleware,    // is user admin?
  getUsageAnalytics
);

module.exports = router;
