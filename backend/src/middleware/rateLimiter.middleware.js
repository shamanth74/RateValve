const { consumeToken } = require("../services/tokenBucket.service");

/**
 * Rate Limiting Middleware (Token Bucket, Tier-Aware)
 * FREE: 10 requests per minute
 * PRO:  50 requests per minute
 */
const rateLimiterMiddleware = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const tier = req.user?.tier || "FREE";

  // apiKey is guaranteed to exist because apiKeyAuthMiddleware runs before this
  const allowed = consumeToken(apiKey, tier);

  if (!allowed) {
    return res.status(429).json({
      message: "Rate limit exceeded. Please try again later.",
    });
  }

  next();
};

module.exports = rateLimiterMiddleware;
