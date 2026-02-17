const express = require('express');
const router = express.Router();
const db = require('../config/db'); // adjust to your DB module

// PUT update user profile
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const [result] = await db.query(
      'UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?',
      [name, phone || null, address || null, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET user profile by id
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const [user] = await db.query('SELECT id, name, email, phone, address FROM users WHERE id = ?', [userId]);
    
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user[0]);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
