const pool = require("./db");

/**
 * Run database migrations on startup.
 * Safe to call multiple times — uses IF NOT EXISTS / IF EXISTS checks.
 */
const initDB = async () => {
  try {
    // Add tier column if it doesn't exist
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'tier'
        ) THEN
          ALTER TABLE users ADD COLUMN tier VARCHAR(10) NOT NULL DEFAULT 'FREE';
        END IF;
      END $$;
    `);

    // Add is_blocked column if it doesn't exist
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'is_blocked'
        ) THEN
          ALTER TABLE users ADD COLUMN is_blocked BOOLEAN NOT NULL DEFAULT FALSE;
        END IF;
      END $$;
    `);

    console.log("✅ Database migrations verified");
  } catch (error) {
    console.error("❌ Database migration failed:", error.message);
    throw error;
  }
};

module.exports = initDB;
