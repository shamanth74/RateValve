const pool = require("../config/db");

const getTotalRequests = async () => {
  const { rows } = await pool.query(
    `SELECT COUNT(*) FROM request_logs`,
    
  );
  return rows[0].count;
};

const getStatusBreakdown = async () => {
  const { rows } = await pool.query(
    `
    SELECT status, COUNT(*) AS count
    FROM request_logs
    GROUP BY status
    `
  );
  return rows;
};

const getEndpointUsage = async () => {
  const { rows } = await pool.query(
    `
    SELECT endpoint, COUNT(*) AS count
    FROM request_logs
    GROUP BY endpoint
    ORDER BY count DESC
    `
  );
  return rows;
};

const getRecentUsage = async (days = 7) => {
  const { rows } = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM request_logs
    WHERE created_at >= NOW() - INTERVAL '${days} days'
    `,
  );
  return rows[0].count;
};
const getPerUserUsage = async () => {
  const { rows } = await pool.query(`
    SELECT 
      u.email,
      COUNT(r.id) AS total_requests,
      COUNT(*) FILTER (WHERE r.status = 'ALLOWED') AS allowed,
      COUNT(*) FILTER (WHERE r.status = 'BLOCKED') AS blocked
    FROM request_logs r
    JOIN users u ON r.user_id = u.id
    GROUP BY u.email
    ORDER BY total_requests DESC
  `);
  return rows;
};
module.exports = {
  getTotalRequests,
  getStatusBreakdown,
  getEndpointUsage,
  getRecentUsage,
  getPerUserUsage
};
