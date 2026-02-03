const express = require('express');
const path = require('path');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const frontendDir = path.join(__dirname, '..', 'frontend');
const adminDir = path.join(__dirname, '..', 'admin');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// Serve static files from frontend and admin folders
app.use(express.static(frontendDir));
app.use('/admin', express.static(adminDir));


// Fallback: serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// Serve admin dashboard as default for /admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(adminDir, 'login.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📁 Serving frontend from: ${frontendDir}`);
});

