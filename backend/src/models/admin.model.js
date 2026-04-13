const pool = require("../config/db");

/**
 * List all non-admin users with aggregated request stats
 */
const getAllUsers = async () => {
  const { rows } = await pool.query(`
    SELECT
      u.id, u.email, u.tier, u.is_blocked, u.created_at,
      COUNT(r.id)::int                                    AS total_requests,
      COUNT(*) FILTER (WHERE r.status = 'ALLOWED')::int   AS allowed_requests,
      COUNT(*) FILTER (WHERE r.status = 'BLOCKED')::int   AS blocked_requests
    FROM users u
    LEFT JOIN request_logs r ON r.user_id = u.id
    WHERE u.role = 'USER'
    GROUP BY u.id
    ORDER BY total_requests DESC
  `);
  return rows;
};

/**
 * Get a single user by ID (includes api_key for admin view)
 */
const getUserById = async (userId) => {
  const { rows } = await pool.query(
    `SELECT id, email, tier, is_blocked, role, api_key, created_at
     FROM users WHERE id = $1`,
    [userId]
  );
  return rows[0] || null;
};

/**
 * Get user's recent request logs
 */
const getUserRequestLogs = async (userId, limit = 50) => {
  const { rows } = await pool.query(
    `SELECT id, endpoint, status, created_at
     FROM request_logs
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return rows;
};

/**
 * Get user's endpoint usage breakdown
 */
const getUserEndpointBreakdown = async (userId) => {
  const { rows } = await pool.query(
    `SELECT endpoint, COUNT(*)::int AS count
     FROM request_logs
     WHERE user_id = $1
     GROUP BY endpoint
     ORDER BY count DESC`,
    [userId]
  );
  return rows;
};

/**
 * Count rate-limit hits for a user
 */
const getUserRateLimitHits = async (userId) => {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM request_logs
     WHERE user_id = $1 AND status = 'BLOCKED'`,
    [userId]
  );
  return rows[0].count;
};

/**
 * Update user tier (FREE / PRO)
 */
const updateUserTier = async (userId, tier) => {
  const { rows } = await pool.query(
    `UPDATE users SET tier = $1 WHERE id = $2 RETURNING id, email, tier`,
    [tier, userId]
  );
  return rows[0] || null;
};

/**
 * Block a user
 */
const blockUser = async (userId) => {
  const { rows } = await pool.query(
    `UPDATE users SET is_blocked = TRUE WHERE id = $1 RETURNING id, email, is_blocked`,
    [userId]
  );
  return rows[0] || null;
};

/**
 * Unblock a user
 */
const unblockUser = async (userId) => {
  const { rows } = await pool.query(
    `UPDATE users SET is_blocked = FALSE WHERE id = $1 RETURNING id, email, is_blocked`,
    [userId]
  );
  return rows[0] || null;
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserRequestLogs,
  getUserEndpointBreakdown,
  getUserRateLimitHits,
  updateUserTier,
  blockUser,
  unblockUser,
};
