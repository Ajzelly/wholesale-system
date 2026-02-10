const db = require("../config/db");


// Get all orders (admin)
exports.getOrders = async (req,res)=>{

  try{

    console.log('Fetching orders...');

    const [rows] = await db.query(`

      SELECT 
        orders.*,
        users.name AS customer

      FROM orders
      LEFT JOIN users ON orders.user_id = users.id
      ORDER BY order_date DESC

    `);

    console.log('Orders fetched:', rows.length);

    res.json(rows);

  }catch(err){

    console.error("GET ORDERS:",err);
    res.status(500).json({error:"Server error"});

  }

};


// Create order (checkout)
// Create order (checkout)
exports.createOrder = async (req, res) => {
  try {
    const { user_id, total_amount, transaction_code } = req.body;

    if (!user_id || !total_amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [result] = await db.query(
      `INSERT INTO orders (user_id, total_amount, status, transaction_code)
       VALUES (?, ?, 'pending', ?)`,
      [user_id, total_amount, transaction_code || null] // save code if provided
    );

    res.json({ success: true, order_id: result.insertId });
  } catch (err) {
    console.error("CREATE ORDER:", err);
    res.status(500).json({ error: "Server error" });
  }
};



// Update status
exports.updateStatus = async (req,res)=>{

  try{

    const id = req.params.id;
    const { status } = req.body;

    await db.query(

      "UPDATE orders SET status=? WHERE id=?",
      [status,id]

    );

    res.json({success:true});

  }catch(err){

    console.error("UPDATE ORDER:",err);
    res.status(500).json({error:"Server error"});

  }

};


// Delete order
exports.deleteOrder = async (req,res)=>{

  try{

    await db.query(
      "DELETE FROM orders WHERE id=?",
      [req.params.id]
    );

    res.json({success:true});

  }catch(err){

    console.error("DELETE ORDER:",err);
    res.status(500).json({error:"Server error"});

  }

};

// Get order count
exports.getOrderCount = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS count FROM orders');
    res.json(rows[0]);
  } catch (err) {
    console.error("GET ORDER COUNT:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get total revenue
exports.getTotalRevenue = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT SUM(total_amount) AS revenue FROM orders WHERE status = "delivered"');
    res.json(rows[0]);
  } catch (err) {
    console.error("GET TOTAL REVENUE:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get recent orders
exports.getRecentOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT orders.*, users.name AS customer
      FROM orders
      LEFT JOIN users ON orders.user_id = users.id
      ORDER BY order_date DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    console.error("GET RECENT ORDERS:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// orderController.js
// Search orders by transaction code OR username
// Search orders by transaction code or username
// controllers/orderController.js
// Search orders by transaction code or username
exports.searchOrders = async (req, res) => {
  try {
    const q = `%${req.query.q}%`;

    const [rows] = await db.query(
      `SELECT orders.*, users.name AS customer
       FROM orders
       LEFT JOIN users ON orders.user_id = users.id
       WHERE orders.transaction_code LIKE ? OR users.name LIKE ?
       ORDER BY orders.order_date DESC`,
      [q, q]
    );

    res.json(rows);
  } catch (err) {
    console.error("SEARCH ORDERS:", err);
    res.status(500).json({ error: "Server error" });
  }
};







