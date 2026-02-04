const express = require('express');
const path = require('path');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const frontendDir = path.join(__dirname, '..', 'frontend');
const adminDir = path.join(__dirname, '..', 'admin');


// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ================= UPLOADS =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ================= API ROUTES =================
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');


app.use('/api', authRoutes);
app.use('/api/products', productRoutes);


// ================= STATIC FILES =================
app.use(express.static(frontendDir));
app.use('/admin', express.static(adminDir));


// ================= ROUTES =================
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(adminDir, 'login.html'));
});


// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📁 Frontend: ${frontendDir}`);
  console.log(`📁 Admin: ${adminDir}`);
});
