const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');
const serviceRoutes = require('./routes/services');
const projectRoutes = require('./routes/projects');
const reviewRoutes = require('./routes/reviews');
const chatRoutes = require('./routes/chats');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');

const socketHandler = require('./socket');

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS allowance
const io = socketIo(server, {
  cors: {
    origin: "*", // allow access from any client domain (including Vite dev server)
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Freelance Digital Marketing Marketplace API is running.' });
});

// Setup socket listeners
socketHandler(io);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
