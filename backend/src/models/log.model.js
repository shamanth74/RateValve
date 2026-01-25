const pool = require("../config/db");

const logRequest = async ({ userId, apiKey, endpoint, status }) => {
  await pool.query(
    `
    INSERT INTO request_logs (user_id, api_key, endpoint, status)
    VALUES ($1, $2, $3, $4)
    `,
    [userId, apiKey, endpoint, status]
  );
};

module.exports = {
  logRequest,
};
