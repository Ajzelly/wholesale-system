const db = require('../config/db');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('GET PRODUCTS ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a product
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category_id,
      description = '',
      stock = 0,
      is_hot,
      is_sale
    } = req.body;

    // Basic validation for required fields
    if (!name || !category_id || !price) {
      return res.status(400).json({ error: 'Name, category, and price are required' });
    }

    // Parse numbers
    const categoryIdNum = parseInt(category_id, 10);
    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10) || 0;

    if (isNaN(categoryIdNum)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    if (isNaN(priceNum)) {
      return res.status(400).json({ error: 'Invalid price' });
    }

    // File upload (image)
    const image = req.file ? req.file.filename : null;

    // Insert into DB
    await db.query(
      `INSERT INTO products
      (name, category_id, description, price, stock, image, is_hot, is_sale)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        categoryIdNum,
        description,
        priceNum,
        stockNum,
        image,
        is_hot ? 1 : 0,
        is_sale ? 1 : 0
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('ADD PRODUCT ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE PRODUCT ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
