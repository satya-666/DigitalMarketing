const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'digital_marketing_secret_jwt_key_2026!';

// @route   POST api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
  const { full_name, email, password, confirmPassword, role } = req.body;

  // Validate fields
  if (!full_name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please enter all required fields.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  if (!['client', 'freelancer'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role selection.' });
  }

  try {
    // Check if user exists
    const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length > 0) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const result = await db.query(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [full_name, email, hashedPassword, role]
    );
    const userId = result.insertId;

    // Create empty profile
    await db.query(
      'INSERT INTO profiles (user_id, bio, skills, experience, portfolio, contact_info, social_links) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, '', '', '', '[]', email, '{}']
    );

    // Sign JWT
    const token = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: userId,
        full_name,
        email,
        role
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter email and password.' });
  }

  try {
    // Check user
    const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Sign JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// @route   GET api/auth/me
// @desc    Get current user details
router.get('/me', verifyToken, async (req, res) => {
  try {
    const users = await db.query(
      'SELECT u.*, p.* FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userDetails = users[0];
    // Don't send password
    delete userDetails.password;

    res.json(userDetails);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Server error fetching user details.' });
  }
});

// @route   POST api/auth/forgot-password
// @desc    Forgot password request (mocked)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }
  
  // Simulate success
  res.json({ message: 'Password recovery email sent! Check your inbox.' });
});

module.exports = router;
