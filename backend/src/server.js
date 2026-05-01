require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000; // ✅ IMPORTANT

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {   // ✅ IMPORTANT
    console.log(`Server running on port ${PORT}`);
  });
});