const db = require("../config/db");

// ================== GET ALL ORDERS (ADMIN) ==================
exports.getOrders = async (req, res) => {
  try {
    // 1️⃣ Fetch all orders with user names
    const [orders] = await db.query(`
      SELECT orders.*, users.name AS customer
      FROM orders
      LEFT JOIN users ON orders.user_id = users.id
      ORDER BY order_date DESC
    `);

    if (!orders.length) return res.json([]);

    // 2️⃣ Fetch all items for these orders in ONE query
    const orderIds = orders.map(o => o.id);
    const [items] = await db.query(`
      SELECT order_items.order_id, order_items.quantity, order_items.price, products.name
      FROM order_items
      LEFT JOIN products ON order_items.product_id = products.id
      WHERE order_items.order_id IN (?)
    `, [orderIds]);

    // 3️⃣ Map items to their orders
    const itemsByOrder = {};
    items.forEach(item => {
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
      itemsByOrder[item.order_id].push(item);
    });

    // 4️⃣ Attach items to orders
    orders.forEach(order => {
      order.items = itemsByOrder[order.id] || [];
    });

    res.json(orders);

  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ================== CREATE ORDER (CHECKOUT) ==================
exports.createOrder = async (req, res) => {
  const { user_id, total_amount, transaction_code, items } = req.body;

  if (!user_id || !total_amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!items || !items.length) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const connection = await db.getConnection(); // get a connection for transaction
  try {
    await connection.beginTransaction();

    // 1️⃣ Insert order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total_amount, status, transaction_code)
       VALUES (?, ?, 'pending', ?)`,
      [user_id, total_amount, transaction_code || null]
    );

    const orderId = orderResult.insertId;

    // 2️⃣ Bulk insert order items
    const values = items.map(item => [orderId, item.id, item.qty, item.price]);
    await connection.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?`,
      [values]
    );

    await connection.commit();
    res.json({ success: true, id: orderId });

  } catch (err) {
    await connection.rollback();
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    connection.release();
  }
};

// ================== UPDATE ORDER STATUS ==================
exports.updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    await db.query("UPDATE orders SET status=? WHERE id=?", [status, id]);
    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE ORDER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ================== DELETE ORDER ==================
exports.deleteOrder = async (req, res) => {
  try {
    await db.query("DELETE FROM orders WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ORDER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ================== GET ORDER COUNT ==================
exports.getOrderCount = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS count FROM orders');
    res.json(rows[0]);
  } catch (err) {
    console.error("GET ORDER COUNT ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ================== GET TOTAL REVENUE ==================
exports.getTotalRevenue = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT SUM(total_amount) AS revenue FROM orders WHERE status = "delivered"'
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("GET TOTAL REVENUE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ================== GET RECENT ORDERS ==================
exports.getRecentOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT orders.*, users.name AS customer
      FROM orders
      LEFT JOIN users ON orders.user_id = users.id
      ORDER BY order_date DESC
      LIMIT 10
    `);

    if (!orders.length) return res.json([]);

    const orderIds = orders.map(o => o.id);
    const [items] = await db.query(`
      SELECT order_items.order_id, order_items.quantity, order_items.price, products.name
      FROM order_items
      LEFT JOIN products ON order_items.product_id = products.id
      WHERE order_items.order_id IN (?)
    `, [orderIds]);

    const itemsByOrder = {};
    items.forEach(item => {
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
      itemsByOrder[item.order_id].push(item);
    });

    orders.forEach(order => {
      order.items = itemsByOrder[order.id] || [];
    });

    res.json(orders);

  } catch (err) {
    console.error("GET RECENT ORDERS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ================== SEARCH ORDERS ==================
exports.searchOrders = async (req, res) => {
  try {
    const q = `%${req.query.q}%`;
    const [orders] = await db.query(`
      SELECT orders.*, users.name AS customer
      FROM orders
      LEFT JOIN users ON orders.user_id = users.id
      WHERE orders.transaction_code LIKE ? OR users.name LIKE ?
      ORDER BY orders.order_date DESC
    `, [q, q]);

    if (!orders.length) return res.json([]);

    const orderIds = orders.map(o => o.id);
    const [items] = await db.query(`
      SELECT order_items.order_id, order_items.quantity, order_items.price, products.name
      FROM order_items
      LEFT JOIN products ON order_items.product_id = products.id
      WHERE order_items.order_id IN (?)
    `, [orderIds]);

    const itemsByOrder = {};
    items.forEach(item => {
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
      itemsByOrder[item.order_id].push(item);
    });

    orders.forEach(order => {
      order.items = itemsByOrder[order.id] || [];
    });

    res.json(orders);

  } catch (err) {
    console.error("SEARCH ORDERS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};
