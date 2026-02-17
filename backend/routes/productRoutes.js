const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const db = require('../config/db');
const productController = require('../controllers/productController');


/* ===============================
   UPLOADS SETUP
================================ */

const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Upload folder created');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const filename = Date.now() + '_' + file.originalname;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Images only'), false);
    }
  }
});


/* ===============================
   ROUTES
================================ */

// Get all products
router.get('/', productController.getAllProducts);


// Add product
router.post('/', upload.single('image'), productController.addProduct);


// Delete product
router.delete('/:id', productController.deleteProduct);


// Get products count (FOR ADMIN DASHBOARD)
router.get('/count', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT COUNT(*) AS count FROM products'
    );

    res.json(rows[0]);

  } catch (err) {
    console.error('❌ PRODUCT COUNT ERROR:', err);

    res.status(500).json({
      error: 'Server error'
    });
  }
});


module.exports = router;
