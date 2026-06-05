const db = require('../config/db');

// Map of userId -> socket.id
const onlineUsers = new Map();

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Register User
    socket.on('registerUser', (userId) => {
      if (userId) {
        socket.userId = Number(userId);
        onlineUsers.set(Number(userId), socket.id);
        console.log(`User registered: ${userId} with socket: ${socket.id}`);
        // Broadcast user status change
        io.emit('userStatusChanged', { userId: Number(userId), status: 'online' });
      }
    });

    // Check Online Status
    socket.on('checkUserStatus', (userId) => {
      const isOnline = onlineUsers.has(Number(userId));
      socket.emit('userStatusResponse', { userId: Number(userId), status: isOnline ? 'online' : 'offline' });
    });

    // Join Chat Room
    socket.on('joinChat', (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`Socket ${socket.id} joined room chat_${chatId}`);
    });

    // Leave Chat Room
    socket.on('leaveChat', (chatId) => {
      socket.leave(`chat_${chatId}`);
      console.log(`Socket ${socket.id} left room chat_${chatId}`);
    });

    // Send Message
    socket.on('sendMessage', async ({ chatId, senderId, recipientId, messageText }) => {
      try {
        // 1. Save message to DB
        const result = await db.query(
          'INSERT INTO messages (chat_id, sender_id, message_text) VALUES (?, ?, ?)',
          [chatId, senderId, messageText]
        );
        const messageId = result.insertId;

        const messageData = {
          id: messageId,
          chat_id: Number(chatId),
          sender_id: Number(senderId),
          message_text: messageText,
          is_read: 0,
          created_at: new Date()
        };

        // 2. Broadcast to chat room
        io.to(`chat_${chatId}`).emit('messageReceived', messageData);

        // 3. Send out-of-chat message notifications if recipient is online but not in chat room
        const recipientSocketId = onlineUsers.get(Number(recipientId));
        if (recipientSocketId) {
          // Emit a general message notification to recipient's individual socket
          io.to(recipientSocketId).emit('messageNotification', {
            chatId: Number(chatId),
            senderId: Number(senderId),
            messageText
          });
        }
      } catch (err) {
        console.error('Error saving socket message:', err);
      }
    });

    // Typing Indicators
    socket.on('typing', ({ chatId, senderId, isTyping }) => {
      socket.to(`chat_${chatId}`).emit('typingResponse', { chatId: Number(chatId), senderId: Number(senderId), isTyping });
    });

    // Read receipts
    socket.on('markAsRead', async ({ chatId, userId }) => {
      try {
        await db.query(
          'UPDATE messages SET is_read = true WHERE chat_id = ? AND sender_id != ?',
          [chatId, userId]
        );
        socket.to(`chat_${chatId}`).emit('messagesRead', { chatId: Number(chatId) });
      } catch (err) {
        console.error('Error marking messages read:', err);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('userStatusChanged', { userId: socket.userId, status: 'offline' });
        console.log(`User unregistered: ${socket.userId}`);
      }
    });
  });
}

module.exports = socketHandler;
module.exports.onlineUsers = onlineUsers;
