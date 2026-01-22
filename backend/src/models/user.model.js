const pool = require('../config/db');

const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const createUser = async (email, passwordHash, apiKey) => {
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, api_key)
     VALUES ($1, $2, $3)
     RETURNING id, email, api_key`,
    [email, passwordHash, apiKey]
  );
  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  createUser
};
