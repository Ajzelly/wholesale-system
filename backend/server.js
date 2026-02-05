const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const frontendDir = path.join(__dirname, '..', 'frontend');
const adminDir = path.join(__dirname, '..', 'admin');


// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ================= UPLOADS =================
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));


// ================= ROUTES =================
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); // ✅ ADD


app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // ✅ ADD


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


// ================= START =================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
