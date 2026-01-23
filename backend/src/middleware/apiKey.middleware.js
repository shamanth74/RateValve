const pool = require("../config/db");

const apiKeyAuthMiddleware = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({
        msg: "Api Key Missing",
      });
    }
    const result = await pool.query(
      "SELECT id, email FROM users WHERE api_key = $1",
      [apiKey],
    );
    if(result.rows.length===0){
        return res.status(403).json({
            msg:"Invalid Api Key"
        })
    }
    req.user=result.rows[0];
    next();
  } 
  catch (e) {
    console.error("API key auth error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = apiKeyAuthMiddleware;