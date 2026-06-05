const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// @route   POST api/reviews
// @desc    Submit a review for a completed project (Clients only)
router.post('/', verifyToken, async (req, res) => {
  const { project_id, rating, review_text } = req.body;
  const clientId = req.user.id;

  if (!project_id || !rating) {
    return res.status(400).json({ message: 'Project ID and rating are required.' });
  }

  const ratingNum = Number(rating);
  if (ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5 stars.' });
  }

  try {
    // Check project details
    const projects = await db.query('SELECT * FROM projects WHERE id = ?', [project_id]);
    if (projects.length === 0) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const project = projects[0];

    // Verify client and status
    if (project.client_id !== clientId) {
      return res.status(403).json({ message: 'You are not authorized to review this project.' });
    }

    if (project.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed projects.' });
    }

    // Check if review already exists
    const existing = await db.query('SELECT id FROM reviews WHERE project_id = ?', [project_id]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this project.' });
    }

    // Insert review
    await db.query(
      'INSERT INTO reviews (project_id, client_id, freelancer_id, rating, review_text) VALUES (?, ?, ?, ?, ?)',
      [project_id, clientId, project.freelancer_id, ratingNum, review_text || '']
    );

    // If it's a real MySQL DB, we must calculate the rating updates.
    // In db.js, the mock INSERT INTO reviews already automatically handles this recalculation.
    if (!db.isMock) {
      // Calculate new ratings
      const reviews = await db.query('SELECT rating FROM reviews WHERE freelancer_id = ?', [project.freelancer_id]);
      const reviewsCount = reviews.length;
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount;

      await db.query(
        'UPDATE profiles SET rating = ?, reviews_count = ? WHERE user_id = ?',
        [Number(avgRating.toFixed(2)), reviewsCount, project.freelancer_id]
      );
    }

    // Notify freelancer
    const clientUser = await db.query('SELECT full_name FROM users WHERE id = ?', [clientId]);
    const clientName = clientUser.length > 0 ? clientUser[0].full_name : 'A client';
    await db.query(
      'INSERT INTO notifications (user_id, content) VALUES (?, ?)',
      [project.freelancer_id, `${clientName} left you a ${ratingNum}-star review.`]
    );

    res.status(201).json({ message: 'Review submitted successfully.' });
  } catch (err) {
    console.error('Error submitting review:', err);
    res.status(500).json({ message: 'Server error submitting review.' });
  }
});

// @route   GET api/reviews/freelancer/:id
// @desc    Get all reviews for a freelancer
router.get('/freelancer/:id', async (req, res) => {
  try {
    const reviews = await db.query(
      `SELECT r.*, u.full_name as client_name, p.profile_picture as client_picture
       FROM reviews r 
       JOIN users u ON r.client_id = u.id 
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE r.freelancer_id = ?
       ORDER BY r.created_at DESC`,
      [req.params.id]
    );

    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Server error fetching reviews.' });
  }
});

module.exports = router;
