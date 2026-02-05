const db = require("../config/db");


// Get all orders (admin)
exports.getOrders = async (req,res)=>{

  try{

    const [rows] = await db.query(`

      SELECT 
        orders.*,
        users.name AS customer

      FROM orders
      LEFT JOIN users ON orders.user_id = users.id
      ORDER BY order_date DESC

    `);

    res.json(rows);

  }catch(err){

    console.error("GET ORDERS:",err);
    res.status(500).json({error:"Server error"});

  }

};


// Create order (checkout)
exports.createOrder = async (req,res)=>{

  try{

    const { user_id, total_amount } = req.body;

    const [result] = await db.query(

      `INSERT INTO orders (user_id,total_amount,status)
       VALUES (?,?, 'pending')`,

      [user_id, total_amount]

    );

    res.json({ success:true, order_id: result.insertId });

  }catch(err){

    console.error("CREATE ORDER:",err);
    res.status(500).json({error:"Server error"});

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
