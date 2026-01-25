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


const getApi = async(userId)=>{
  const { rows } = await pool.query(
  `SELECT api_key FROM users WHERE id = $1`,
  [userId]
);

if (rows.length === 0) return null;

return rows[0].api_key;
}

module.exports = {
  findUserByEmail,
  createUser,
  getApi
};
