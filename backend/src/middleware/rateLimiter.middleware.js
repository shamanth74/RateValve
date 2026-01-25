const { consumeToken } = require("../services/tokenBucket.service");
const logRequest=require("../models/log.model")
/**
 * Rate Limiting Middleware (Token Bucket)
 * Default: 10 requests per minute per API key
 */
const rateLimiterMiddleware = async(req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  // apiKey is guaranteed to exist because apiKeyAuthMiddleware runs before this
  const allowed = consumeToken(apiKey);

  if (!allowed) {
    return res.status(429).json({
      message: "Rate limit exceeded. Please try again later.",
    });
  }
  
  next();
};

module.exports = rateLimiterMiddleware;
