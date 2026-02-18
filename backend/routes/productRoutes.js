const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const db = require('../config/db');


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

// ✅ Get all products
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('❌ GET ALL ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ Get single product (FOR EDIT)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error('❌ GET PRODUCT ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ Add product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price, category_id, description, stock, is_hot, is_sale } = req.body;

    const image = req.file ? req.file.filename : null;

    await db.query(
      `INSERT INTO products 
       (name, price, category_id, description, stock, is_hot, is_sale, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, price, category_id, description, stock, is_hot, is_sale, image]
    );

    res.json({ message: 'Product added successfully' });

  } catch (err) {
    console.error('❌ ADD ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ Update product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price, category_id, description, stock, is_hot, is_sale } = req.body;

    const [rows] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existing = rows[0];

    const image = req.file ? req.file.filename : existing.image;

    await db.query(
      `UPDATE products SET
        name = ?,
        price = ?,
        category_id = ?,
        description = ?,
        stock = ?,
        is_hot = ?,
        is_sale = ?,
        image = ?
       WHERE id = ?`,
      [
        name || existing.name,
        price || existing.price,
        category_id || existing.category_id,
        description || existing.description,
        stock || existing.stock,
        is_hot ?? existing.is_hot,
        is_sale ?? existing.is_sale,
        image,
        req.params.id
      ]
    );

    res.json({ message: 'Product updated successfully' });

  } catch (err) {
    console.error('❌ UPDATE ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ Delete product
router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      'DELETE FROM products WHERE id = ?',
      [req.params.id]
    );

    res.json({ message: 'Product deleted' });

  } catch (err) {
    console.error('❌ DELETE ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
