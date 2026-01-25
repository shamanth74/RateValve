const { logRequest } = require("../models/log.model");

const requestLoggerMiddleware = (req, res, next) => {
  res.on("finish", async () => {
    try {
      const status =
        res.statusCode === 429 ? "BLOCKED" : "ALLOWED";
        
      await logRequest({
        userId: req.user.id,
        apiKey: req.headers["x-api-key"],
        endpoint: req.originalUrl,
        status,
      });
    } catch (error) {
      console.error("Request logging failed:", error);
    }
  });

  next();
};

module.exports = requestLoggerMiddleware;
