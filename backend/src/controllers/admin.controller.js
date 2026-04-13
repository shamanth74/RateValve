const {
  getAllUsers,
  getUserById,
  getUserRequestLogs,
  getUserEndpointBreakdown,
  getUserRateLimitHits,
  updateUserTier,
  blockUser,
  unblockUser,
} = require("../models/admin.model");
const { resetBucket } = require("../services/tokenBucket.service");

/**
 * GET /admin/users
 * List all non-admin users with request stats
 */
const listUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json({ users });
  } catch (error) {
    console.error("listUsers error:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

/**
 * GET /admin/users/:id
 * User detail + analytics (logs, endpoints, rate limit hits)
 */
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const [logs, endpoints, rateLimitHits] = await Promise.all([
      getUserRequestLogs(id),
      getUserEndpointBreakdown(id),
      getUserRateLimitHits(id),
    ]);

    return res.status(200).json({
      user,
      analytics: { logs, endpoints, rateLimitHits },
    });
  } catch (error) {
    console.error("getUserDetails error:", error);
    return res.status(500).json({ message: "Failed to fetch user details" });
  }
};

/**
 * PATCH /admin/users/:id/tier
 * Update user tier (FREE / PRO) and reset rate-limit bucket
 */
const changeTier = async (req, res) => {
  try {
    const { id } = req.params;
    const { tier } = req.body;

    if (!["FREE", "PRO"].includes(tier)) {
      return res
        .status(400)
        .json({ message: "Invalid tier. Use FREE or PRO." });
    }

    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updated = await updateUserTier(id, tier);

    // Reset the token bucket so new tier limits apply immediately
    resetBucket(user.api_key);

    return res
      .status(200)
      .json({ message: `Tier updated to ${tier}`, user: updated });
  } catch (error) {
    console.error("changeTier error:", error);
    return res.status(500).json({ message: "Failed to update tier" });
  }
};

/**
 * PATCH /admin/users/:id/block
 * Block a user (prevents API access)
 */
const blockUserHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "ADMIN") {
      return res.status(400).json({ message: "Cannot block an admin" });
    }

    const blocked = await blockUser(id);
    return res.status(200).json({ message: "User blocked", user: blocked });
  } catch (error) {
    console.error("blockUser error:", error);
    return res.status(500).json({ message: "Failed to block user" });
  }
};

/**
 * PATCH /admin/users/:id/unblock
 * Unblock a user (restores API access)
 */
const unblockUserHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const unblocked = await unblockUser(id);
    return res
      .status(200)
      .json({ message: "User unblocked", user: unblocked });
  } catch (error) {
    console.error("unblockUser error:", error);
    return res.status(500).json({ message: "Failed to unblock user" });
  }
};

module.exports = {
  listUsers,
  getUserDetails,
  changeTier,
  blockUserHandler,
  unblockUserHandler,
};
