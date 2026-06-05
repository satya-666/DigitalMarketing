const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// @route   GET api/notifications
// @desc    Get user notifications
router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Server error fetching notifications.' });
  }
});

// @route   PUT api/notifications/read
// @desc    Mark all notifications as read
router.put('/read', verifyToken, async (req, res) => {
  try {
    await db.query(
      'UPDATE notifications SET is_read = true WHERE user_id = ?',
      [req.user.id]
    );
    res.json({ message: 'Notifications marked as read.' });
  } catch (err) {
    console.error('Error updating notifications:', err);
    res.status(500).json({ message: 'Server error updating notifications.' });
  }
});

module.exports = router;
