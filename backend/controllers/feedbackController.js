const db = require("../config/db");

// Get all feedback with user info and replies
exports.getFeedback = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.*, u.name AS user_name
      FROM feedback f
      LEFT JOIN users u ON f.user_id = u.id
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("GET FEEDBACK:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create new feedback (user side)
exports.createFeedback = async (req, res) => {
  try {
    const { user_id, message } = req.body;

    if (!user_id || !message) {
      return res.status(400).json({ error: "Missing user_id or message" });
    }

    await db.query(
      `INSERT INTO feedback (user_id, message) VALUES (?, ?)`,
      [user_id, message]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("CREATE FEEDBACK:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Reply/update reply to feedback (admin side)
exports.replyToFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    await db.query(
      `UPDATE feedback SET reply = ? WHERE id = ?`,
      [reply, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("REPLY FEEDBACK:", err);
    res.status(500).json({ error: "Server error" });
  }
};
