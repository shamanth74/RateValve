/**
 * Block Middleware
 * Rejects requests from blocked users with HTTP 403.
 * Must run AFTER apiKeyAuthMiddleware (needs req.user.is_blocked)
 * Must run BEFORE rateLimiterMiddleware (save resources on blocked users)
 */
const blockMiddleware = (req, res, next) => {
  if (req.user.is_blocked) {
    return res.status(403).json({
      error: "BLOCKED",
      message: "Your account has been blocked. Contact support.",
    });
  }
  next();
};

module.exports = blockMiddleware;
