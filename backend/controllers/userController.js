const db = require('../config/db');

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, name, email, created_at FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

exports.getUserCount = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT COUNT(*) AS count FROM users');
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ error: 'Error fetching user count' });
  }
};
