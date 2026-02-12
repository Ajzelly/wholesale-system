const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// CRUD routes
router.get('/', orderController.getOrders);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateStatus);
router.delete('/:id', orderController.deleteOrder);

// Extra endpoints
router.get('/count', orderController.getOrderCount);
router.get('/revenue', orderController.getTotalRevenue);
router.get('/recent', orderController.getRecentOrders);
router.get('/search', orderController.searchOrders);



module.exports = router; // ✅ export the router, not the controller

// controllers/orderController.js
const db = require('../config/db'); // adjust path if needed


exports.createOrder = async (req, res) => {
  console.log("BODY RECEIVED:", req.body);
  try {
    const { user_id, total_amount, transaction_code, cartItems } = req.body;

    if (!user_id || !total_amount || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Missing required fields or cart is empty" });
    }

    // 1️⃣ Insert into orders table
    const [result] = await db.query(
      `INSERT INTO orders (user_id, total_amount, status, transaction_code)
       VALUES (?, ?, 'pending', ?)`,
      [user_id, total_amount, transaction_code || null]
    );

    const orderId = result.insertId;

    // 2️⃣ Insert into order_items table
    for (const item of cartItems) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    res.json({ success: true, orderId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }

};


exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM orders WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete order" });
  }
};

exports.getOrderCount = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS count FROM orders");
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get order count" });
  }
};

exports.getTotalRevenue = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT SUM(total_amount) AS revenue FROM orders");
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get total revenue" });
  }
};

exports.getRecentOrders = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders ORDER BY order_date DESC LIMIT 5");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get recent orders" });
  }
};
