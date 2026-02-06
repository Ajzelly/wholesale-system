const db = require('../config/db');


/* ===============================
   GET ALL USERS (ADMIN)
================================ */

exports.getAllUsers = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT 
        id,
        name,
        email,
        created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json(rows);

  } catch (err) {

    console.error("GET USERS ERROR:", err);

    res.status(500).json({ error: 'Server error' });

  }
};



/* ===============================
   COUNT USERS
================================ */

exports.countUsers = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT COUNT(*) AS count
      FROM users
    `);

    res.json(rows[0]);

  } catch (err) {

    console.error("COUNT USERS ERROR:", err);

    res.status(500).json({ error: 'Server error' });

  }
};
