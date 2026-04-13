require('dotenv').config();
const app = require('./app');
const initDB = require('./config/db.init');

const PORT = process.env.PORT || 5000;

// Run migrations then start the server
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });