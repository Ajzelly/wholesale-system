const express = require('express');
const path = require('path');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const frontendDir = path.join(__dirname, '..', 'frontend');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// Serve all static files from frontend folder
app.use(express.static(frontendDir));

// Fallback: serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📁 Serving frontend from: ${frontendDir}`);
});

