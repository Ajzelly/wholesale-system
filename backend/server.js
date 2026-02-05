const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ================= DIRECTORIES =================

const frontendDir = path.join(__dirname, '..', 'frontend');
const adminDir = path.join(__dirname, '..', 'admin');

// ================= MIDDLEWARE =================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= UPLOADS =================

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================= API ROUTES =================

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const profileRoutes = require('./routes/profileRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/feedback', feedbackRoutes);

// ================= STATIC FILES =================

app.use(express.static(frontendDir));
app.use('/admin', express.static(adminDir));

// ================= MAIN ROUTES =================

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(adminDir, 'login.html'));
});

// ================= START SERVER =================

app.listen(PORT, () => {
  console.log('====================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🛠️ Admin:    http://localhost:${PORT}/admin`);
  console.log('====================================');
});
