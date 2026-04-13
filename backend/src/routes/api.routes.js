const express = require("express");
const apiDataController = require("../controllers/api.controller");
const apiKeyAuthMiddleware = require("../middleware/apiKey.middleware");
const blockMiddleware = require("../middleware/block.middleware");
const rateLimiterMiddleware = require("../middleware/rateLimiter.middleware");
const requestLoggerMiddleware = require("../middleware/requestLogger.middleware");

const router = express.Router();

/**
 * GET /api/data
 * Protected API endpoint
 *
 * Middleware chain:
 * 1. apiKeyAuth   — validate key, attach req.user (with tier, is_blocked)
 * 2. block        — reject blocked users (403) BEFORE rate limiting
 * 3. requestLogger — log the request outcome
 * 4. rateLimiter  — tier-aware token bucket
 * 5. controller   — return API data
 */
router.get(
  "/data",
  apiKeyAuthMiddleware,
  blockMiddleware,
  requestLoggerMiddleware,
  rateLimiterMiddleware,
  apiDataController
);

module.exports = router;