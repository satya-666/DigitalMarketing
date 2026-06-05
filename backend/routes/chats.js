const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// @route   POST api/chats
// @desc    Start/Get a chat session with another user
router.post('/', verifyToken, async (req, res) => {
  const { recipient_id } = req.body;
  const myId = req.user.id;

  if (!recipient_id) {
    return res.status(400).json({ message: 'Recipient ID is required.' });
  }

  if (Number(recipient_id) === myId) {
    return res.status(400).json({ message: 'You cannot chat with yourself.' });
  }

  // Determine client vs freelancer
  // We assume: if my role is client, I am client, recipient is freelancer, and vice versa.
  // We'll query DB to verify the recipient's role, or structure the client_id/freelancer_id based on who is what.
  try {
    const users = await db.query('SELECT role FROM users WHERE id = ?', [recipient_id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Recipient user not found.' });
    }

    const recipient = users[0];
    const myRole = req.user.role;

    let clientId, freelancerId;
    if (myRole === 'client' && recipient.role === 'freelancer') {
      clientId = myId;
      freelancerId = Number(recipient_id);
    } else if (myRole === 'freelancer' && recipient.role === 'client') {
      clientId = Number(recipient_id);
      freelancerId = myId;
    } else {
      // Allow general user-to-user chat as a fallback
      // Designate smaller ID as client and larger ID as freelancer to keep schema UNIQUE key happy
      clientId = Math.min(myId, Number(recipient_id));
      freelancerId = Math.max(myId, Number(recipient_id));
    }

    // Check if chat already exists
    let chats = await db.query(
      'SELECT * FROM chats WHERE client_id = ? AND freelancer_id = ?',
      [clientId, freelancerId]
    );

    let chatId;
    if (chats.length > 0) {
      chatId = chats[0].id;
    } else {
      const result = await db.query(
        'INSERT INTO chats (client_id, freelancer_id) VALUES (?, ?)',
        [clientId, freelancerId]
      );
      chatId = result.insertId;
    }

    res.json({ chatId });
  } catch (err) {
    console.error('Error starting chat:', err);
    res.status(500).json({ message: 'Server error starting chat.' });
  }
});

// @route   GET api/chats
// @desc    Get all chat threads for the current user
router.get('/', verifyToken, async (req, res) => {
  const myId = req.user.id;
  try {
    let threads;
    if (!db.isMock) {
      // In MySQL, we build a query returning the chat thread details with the recipient.
      threads = await db.query(
        `SELECT c.id, c.created_at,
                IF(c.client_id = ?, c.freelancer_id, c.client_id) as recipient_id,
                u.full_name as recipient_name, u.role as recipient_role,
                p.profile_picture as recipient_picture
         FROM chats c
         JOIN users u ON u.id = IF(c.client_id = ?, c.freelancer_id, c.client_id)
         LEFT JOIN profiles p ON p.user_id = u.id
         WHERE c.client_id = ? OR c.freelancer_id = ?
         ORDER BY c.created_at DESC`,
        [myId, myId, myId, myId]
      );
    } else {
      // In mock DB, we call the custom thread resolver in mock queries
      threads = await db.query('SELECT c.*, u.full_name FROM chats c', [myId]);
    }

    // For each thread, let's append the last message
    for (let thread of threads) {
      const messages = await db.query(
        'SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at DESC LIMIT 1',
        [thread.id]
      );
      thread.last_message = messages.length > 0 ? messages[0] : null;
    }

    res.json(threads);
  } catch (err) {
    console.error('Error fetching chat threads:', err);
    res.status(500).json({ message: 'Server error fetching chat threads.' });
  }
});

// @route   GET api/chats/:chatId/messages
// @desc    Get all messages inside a specific chat thread
router.get('/:chatId/messages', verifyToken, async (req, res) => {
  const chatId = req.params.chatId;
  const myId = req.user.id;

  try {
    // Check access: user must be either client or freelancer of the chat
    const chats = await db.query('SELECT * FROM chats WHERE id = ?', [chatId]);
    if (chats.length === 0) {
      return res.status(404).json({ message: 'Chat thread not found.' });
    }

    const chat = chats[0];
    if (chat.client_id !== myId && chat.freelancer_id !== myId) {
      return res.status(403).json({ message: 'Access denied to this chat.' });
    }

    // Mark messages as read (messages sent by the other person in this chat)
    await db.query(
      'UPDATE messages SET is_read = true WHERE chat_id = ? AND sender_id != ?',
      [chatId, myId]
    );

    // Fetch messages
    const messages = await db.query(
      `SELECT m.*, u.full_name as sender_name 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE m.chat_id = ? 
       ORDER BY m.created_at ASC`,
      [chatId]
    );

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server error fetching messages.' });
  }
});

module.exports = router;
