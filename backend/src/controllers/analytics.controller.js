const {
  getTotalRequests,
  getStatusBreakdown,
  getEndpointUsage,
  getRecentUsage,
  getPerUserUsage
} = require("../models/analytics.model");

const getUsageAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      totalRequests,
      statusBreakdown,
      endpointUsage,
      last7Days,
      perUsage
    ] = await Promise.all([
      getTotalRequests(),
      getStatusBreakdown(),
      getEndpointUsage(),
      getRecentUsage(),
      getPerUserUsage()
    ]);

    return res.status(200).json({
      totalRequests,
      statusBreakdown,
      endpointUsage,
      last7Days,
      perUsage
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch usage analytics",
    });
  }
};

module.exports = {
  getUsageAnalytics,
};
