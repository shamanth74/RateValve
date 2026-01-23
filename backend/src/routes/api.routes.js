const express = require("express");
const  apiDataController  = require("../controllers/api.controller");
const apiKeyAuthMiddleware=require('../middleware/apiKey.middleware');
const rateLimiterMiddleware=require('../middleware/rateLimiter.middleware')
const router = express.Router();

/**
 * GET /api/data
 * Protected API endpoint
 */
router.get("/data", apiKeyAuthMiddleware,rateLimiterMiddleware,apiDataController);

module.exports = router;