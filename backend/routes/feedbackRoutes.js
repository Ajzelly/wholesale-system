const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all feedback with user names (admin view)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
         f.id, 
         f.user_id, 
         f.message, 
         f.rating, 
         f.reply, 
         f.created_at, 
         u.name AS user_name
       FROM feedback f
       LEFT JOIN users u ON f.user_id = u.id
       ORDER BY f.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Get feedback error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new feedback (user submission)
router.post('/', async (req, res) => {
  try {
    const { user_id, message, rating } = req.body;

    if (!user_id || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await db.query(
      `INSERT INTO feedback (user_id, message, rating, created_at) VALUES (?, ?, ?, NOW())`,
      [user_id, message, rating || null]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Post feedback error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update reply to feedback (admin replies)
router.put('/:id/reply', async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ error: 'Reply is required' });
    }

    await db.query(
      `UPDATE feedback SET reply = ? WHERE id = ?`,
      [reply, feedbackId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Reply update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
