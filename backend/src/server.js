require('dotenv').config(); // ✅ simple & reliable

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
  });
});