const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// @route   POST api/projects
// @desc    Hire a freelancer / Book a service (Clients only)
router.post('/', verifyToken, async (req, res) => {
  const { freelancer_id, service_id, price, delivery_time } = req.body;
  const clientId = req.user.id;

  if (clientId === Number(freelancer_id)) {
    return res.status(400).json({ message: 'You cannot hire yourself.' });
  }

  if (!freelancer_id || !price || !delivery_time) {
    return res.status(400).json({ message: 'Missing booking details.' });
  }

  try {
    // Insert project
    const result = await db.query(
      'INSERT INTO projects (client_id, freelancer_id, service_id, price, delivery_time, status) VALUES (?, ?, ?, ?, ?, ?)',
      [clientId, freelancer_id, service_id || null, price, delivery_time, 'pending']
    );

    const projectId = result.insertId;

    // Fetch client name for notification
    const clientUser = await db.query('SELECT full_name FROM users WHERE id = ?', [clientId]);
    const clientName = clientUser.length > 0 ? clientUser[0].full_name : 'A client';

    // Notify freelancer
    await db.query(
      'INSERT INTO notifications (user_id, content) VALUES (?, ?)',
      [freelancer_id, `New project request from ${clientName} for $${price}`]
    );

    res.status(201).json({ message: 'Booking created successfully.', projectId });
  } catch (err) {
    console.error('Error creating project booking:', err);
    res.status(500).json({ message: 'Server error creating booking.' });
  }
});

// @route   GET api/projects/client
// @desc    Get all projects for current client
router.get('/client', verifyToken, async (req, res) => {
  try {
    const projects = await db.query(
      `SELECT p.*, s.title as service_title, s.image_url as service_image,
              u.full_name as freelancer_name, prof.profile_picture as freelancer_picture
       FROM projects p 
       LEFT JOIN services s ON p.service_id = s.id 
       JOIN users u ON p.freelancer_id = u.id 
       LEFT JOIN profiles prof ON u.id = prof.user_id
       WHERE p.client_id = ?
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    res.json(projects);
  } catch (err) {
    console.error('Error fetching client projects:', err);
    res.status(500).json({ message: 'Server error fetching projects.' });
  }
});

// @route   GET api/projects/freelancer
// @desc    Get all projects for current freelancer
router.get('/freelancer', verifyToken, async (req, res) => {
  try {
    const projects = await db.query(
      `SELECT p.*, s.title as service_title, s.image_url as service_image,
              u.full_name as client_name, prof.profile_picture as client_picture
       FROM projects p 
       LEFT JOIN services s ON p.service_id = s.id 
       JOIN users u ON p.client_id = u.id 
       LEFT JOIN profiles prof ON u.id = prof.user_id
       WHERE p.freelancer_id = ?
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    res.json(projects);
  } catch (err) {
    console.error('Error fetching freelancer projects:', err);
    res.status(500).json({ message: 'Server error fetching projects.' });
  }
});

// @route   PUT api/projects/:id/status
// @desc    Update project status (Freelancer accepts/rejects/progresses/completes)
router.put('/:id/status', verifyToken, async (req, res) => {
  const projectId = req.params.id;
  const { status } = req.body;
  const userId = req.user.id;

  if (!['accepted', 'rejected', 'in_progress', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status transition.' });
  }

  try {
    const projects = await db.query('SELECT * FROM projects WHERE id = ?', [projectId]);
    if (projects.length === 0) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const project = projects[0];

    // Verify user is the freelancer for this project
    if (project.freelancer_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized status change.' });
    }

    // Update status
    await db.query('UPDATE projects SET status = ? WHERE id = ?', [status, projectId]);

    // Notify client
    const freelancerUser = await db.query('SELECT full_name FROM users WHERE id = ?', [userId]);
    const freelancerName = freelancerUser.length > 0 ? freelancerUser[0].full_name : 'Freelancer';

    await db.query(
      'INSERT INTO notifications (user_id, content) VALUES (?, ?)',
      [project.client_id, `Project status updated to "${status}" by ${freelancerName}.`]
    );

    res.json({ message: `Project status updated to ${status}.` });
  } catch (err) {
    console.error('Error updating project status:', err);
    res.status(500).json({ message: 'Server error updating project status.' });
  }
});

module.exports = router;
