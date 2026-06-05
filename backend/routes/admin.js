const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

// Apply admin protection to all routes in this router
router.use(verifyToken, requireRole(['admin']));

// @route   GET api/admin/stats
// @desc    Get dashboard metrics & analytics
router.get('/stats', async (req, res) => {
  try {
    let usersCount, freelancersCount, clientsCount, servicesCount, projectsCount, totalEarnings, logs;
    
    if (!db.isMock) {
      const uRes = await db.query('SELECT COUNT(*) as cnt FROM users');
      usersCount = uRes[0].cnt;

      const fRes = await db.query("SELECT COUNT(*) as cnt FROM users WHERE role = 'freelancer'");
      freelancersCount = fRes[0].cnt;

      const cRes = await db.query("SELECT COUNT(*) as cnt FROM users WHERE role = 'client'");
      clientsCount = cRes[0].cnt;

      const sRes = await db.query('SELECT COUNT(*) as cnt FROM services');
      servicesCount = sRes[0].cnt;

      const pRes = await db.query('SELECT COUNT(*) as cnt FROM projects');
      projectsCount = pRes[0].cnt;

      const eRes = await db.query("SELECT SUM(price) as earnings FROM projects WHERE status = 'completed'");
      totalEarnings = eRes[0].earnings || 0;
    } else {
      // Mock db calculation
      usersCount = db.mockDb.users.length;
      freelancersCount = db.mockDb.users.filter(u => u.role === 'freelancer').length;
      clientsCount = db.mockDb.users.filter(u => u.role === 'client').length;
      servicesCount = db.mockDb.services.length;
      projectsCount = db.mockDb.projects.length;
      totalEarnings = db.mockDb.projects
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.price), 0);
    }

    res.json({
      usersCount,
      freelancersCount,
      clientsCount,
      servicesCount,
      projectsCount,
      totalEarnings
    });
  } catch (err) {
    console.error('Error fetching admin analytics:', err);
    res.status(500).json({ message: 'Server error fetching analytics.' });
  }
});

// @route   GET api/admin/users
// @desc    List all users
router.get('/users', async (req, res) => {
  try {
    const users = await db.query('SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (err) {
    console.error('Error listing users:', err);
    res.status(500).json({ message: 'Server error listing users.' });
  }
});

// @route   DELETE api/admin/users/:id
// @desc    Remove spam / inappropriate user accounts
router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const adminId = req.user.id;

  if (Number(userId) === adminId) {
    return res.status(400).json({ message: 'You cannot delete your own admin account.' });
  }

  try {
    // Delete user (this will cascade delete profiles, services, projects if MySQL schema is active)
    if (!db.isMock) {
      await db.query('DELETE FROM users WHERE id = ?', [userId]);
    } else {
      await db.query('DELETE FROM users WHERE id = ?', [userId]);
    }

    // Log admin action
    await db.query('INSERT INTO admin (admin_user_id, action_logged, target_id) VALUES (?, ?, ?)', 
      [adminId, 'Deleted user account', userId]
    );

    res.json({ message: 'User account deleted successfully.' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error deleting user.' });
  }
});

// @route   GET api/admin/services
// @desc    List all services for moderation
router.get('/services', async (req, res) => {
  try {
    const services = await db.query(
      `SELECT s.*, u.full_name as freelancer_name, c.name as category_name
       FROM services s 
       JOIN users u ON s.freelancer_id = u.id
       JOIN categories c ON s.category_id = c.id
       ORDER BY s.created_at DESC`
    );
    res.json(services);
  } catch (err) {
    console.error('Error listing services:', err);
    res.status(500).json({ message: 'Server error listing services.' });
  }
});

// @route   DELETE api/admin/services/:id
// @desc    Remove spam service listings
router.delete('/services/:id', async (req, res) => {
  const serviceId = req.params.id;
  const adminId = req.user.id;

  try {
    await db.query('DELETE FROM services WHERE id = ?', [serviceId]);

    // Log admin action
    await db.query('INSERT INTO admin (admin_user_id, action_logged, target_id) VALUES (?, ?, ?)',
      [adminId, 'Deleted service listing', serviceId]
    );

    res.json({ message: 'Service listing deleted successfully.' });
  } catch (err) {
    console.error('Error deleting service listing:', err);
    res.status(500).json({ message: 'Server error deleting service.' });
  }
});

// @route   GET api/admin/reviews
// @desc    List all reviews for moderation
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await db.query(
      `SELECT r.*, u.full_name as client_name, f.full_name as freelancer_name
       FROM reviews r 
       JOIN users u ON r.client_id = u.id
       JOIN users f ON r.freelancer_id = f.id
       ORDER BY r.created_at DESC`
    );
    res.json(reviews);
  } catch (err) {
    console.error('Error listing reviews:', err);
    res.status(500).json({ message: 'Server error listing reviews.' });
  }
});

// @route   DELETE api/admin/reviews/:id
// @desc    Delete/moderate reviews
router.delete('/reviews/:id', async (req, res) => {
  const reviewId = req.params.id;
  const adminId = req.user.id;

  try {
    await db.query('DELETE FROM reviews WHERE id = ?', [reviewId]);

    // Log admin action
    await db.query('INSERT INTO admin (admin_user_id, action_logged, target_id) VALUES (?, ?, ?)',
      [adminId, 'Deleted review rating', reviewId]
    );

    res.json({ message: 'Review deleted successfully.' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ message: 'Server error deleting review.' });
  }
});

// @route   GET api/admin/logs
// @desc    Get administrative logs
router.get('/logs', async (req, res) => {
  try {
    const logs = await db.query(
      `SELECT a.*, u.full_name as admin_name 
       FROM admin a 
       JOIN users u ON a.admin_user_id = u.id 
       ORDER BY a.timestamp DESC`
    );
    res.json(logs);
  } catch (err) {
    console.error('Error listing logs:', err);
    res.status(500).json({ message: 'Server error listing audit logs.' });
  }
});

module.exports = router;
