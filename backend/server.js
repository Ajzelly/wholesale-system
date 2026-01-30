const express = require('express');
const db = require('./config/db');  // DB connection
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Database test route
app.get('/db-test', (req, res) => {
  db.query('SHOW TABLES', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
