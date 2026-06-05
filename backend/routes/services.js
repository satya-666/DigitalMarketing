const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

// @route   GET api/services/categories
// @desc    Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await db.query('SELECT * FROM categories');
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Server error fetching categories.' });
  }
});

// @route   GET api/services
// @desc    Get all services with filters, sorting, and search
router.get('/', async (req, res) => {
  const { search, category, minPrice, maxPrice, minRating, sort } = req.query;

  try {
    // We execute the base query
    let queryStr = `
      SELECT s.*, c.name as category_name, c.slug as category_slug, 
             u.full_name as freelancer_name, p.profile_picture as freelancer_picture,
             p.rating as freelancer_rating, p.reviews_count as freelancer_reviews_count
      FROM services s 
      JOIN categories c ON s.category_id = c.id 
      JOIN users u ON s.freelancer_id = u.id 
      LEFT JOIN profiles p ON u.id = p.user_id
    `;
    
    let queryParams = [];

    // If it's a real MySQL DB, we build the SQL query. 
    // If it is mock mode, db.query returns the full joined array, and we filter it in Javascript below.
    if (!db.isMock) {
      let conditions = [];
      if (search) {
        conditions.push('(s.title LIKE ? OR s.description LIKE ?)');
        queryParams.push(`%${search}%`, `%${search}%`);
      }
      if (category) {
        conditions.push('(c.slug = ? OR c.name = ?)');
        queryParams.push(category, category);
      }
      if (minPrice) {
        conditions.push('s.price >= ?');
        queryParams.push(Number(minPrice));
      }
      if (maxPrice) {
        conditions.push('s.price <= ?');
        queryParams.push(Number(maxPrice));
      }
      if (minRating) {
        conditions.push('p.rating >= ?');
        queryParams.push(Number(minRating));
      }

      if (conditions.length > 0) {
        queryStr += ' WHERE ' + conditions.join(' AND ');
      }

      // Add Sorting
      if (sort === 'lowest_price') {
        queryStr += ' ORDER BY s.price ASC';
      } else if (sort === 'highest_price') {
        queryStr += ' ORDER BY s.price DESC';
      } else if (sort === 'highest_rated') {
        queryStr += ' ORDER BY p.rating DESC';
      } else {
        queryStr += ' ORDER BY s.created_at DESC'; // default newest
      }

      const services = await db.query(queryStr, queryParams);
      return res.json(services);
    } else {
      // Mock mode evaluation
      let services = await db.query(queryStr);

      // Search filter
      if (search) {
        const sLower = search.toLowerCase();
        services = services.filter(s => 
          s.title.toLowerCase().includes(sLower) || 
          s.description.toLowerCase().includes(sLower)
        );
      }

      // Category filter
      if (category) {
        services = services.filter(s => 
          s.category_slug === category || 
          s.category_name.toLowerCase() === category.toLowerCase()
        );
      }

      // Price filters
      if (minPrice) {
        services = services.filter(s => s.price >= Number(minPrice));
      }
      if (maxPrice) {
        services = services.filter(s => s.price <= Number(maxPrice));
      }

      // Rating filter
      if (minRating) {
        services = services.filter(s => s.freelancer_rating >= Number(minRating));
      }

      // Sorting
      if (sort === 'lowest_price') {
        services.sort((a, b) => a.price - b.price);
      } else if (sort === 'highest_price') {
        services.sort((a, b) => b.price - a.price);
      } else if (sort === 'highest_rated') {
        services.sort((a, b) => b.freelancer_rating - a.freelancer_rating);
      } else {
        // newest
        services.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      return res.json(services);
    }
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ message: 'Server error fetching services.' });
  }
});

// @route   GET api/services/:id
// @desc    Get single service details by ID
router.get('/:id', async (req, res) => {
  try {
    const services = await db.query(
      `SELECT s.*, c.name as category_name, c.slug as category_slug,
              u.full_name as freelancer_name, p.profile_picture as freelancer_picture,
              p.bio as freelancer_bio, p.rating as freelancer_rating, p.reviews_count as freelancer_reviews_count
       FROM services s 
       JOIN categories c ON s.category_id = c.id 
       JOIN users u ON s.freelancer_id = u.id 
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE s.id = ?`,
      [req.params.id]
    );

    if (services.length === 0) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.json(services[0]);
  } catch (err) {
    console.error('Error fetching service:', err);
    res.status(500).json({ message: 'Server error fetching service details.' });
  }
});

// @route   POST api/services
// @desc    Create a new service listing (Freelancers only)
router.post('/', verifyToken, requireRole(['freelancer']), async (req, res) => {
  const { category_id, title, description, price, delivery_time, image_url } = req.body;

  if (!category_id || !title || !description || !price || !delivery_time) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const result = await db.query(
      'INSERT INTO services (freelancer_id, category_id, title, description, price, delivery_time, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, category_id, title, description, price, delivery_time, image_url || '/uploads/default-service.png']
    );

    res.status(201).json({ message: 'Service created successfully.', serviceId: result.insertId });
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ message: 'Server error creating service listing.' });
  }
});

// @route   PUT api/services/:id
// @desc    Edit a service listing (Own services only)
router.put('/:id', verifyToken, requireRole(['freelancer']), async (req, res) => {
  const { category_id, title, description, price, delivery_time, image_url } = req.body;
  const serviceId = req.params.id;
  const freelancerId = req.user.id;

  try {
    const result = await db.query(
      'UPDATE services SET title = ?, description = ?, price = ?, delivery_time = ?, category_id = ?, image_url = ? WHERE id = ? AND freelancer_id = ?',
      [title, description, price, delivery_time, category_id, image_url, serviceId, freelancerId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service not found or unauthorized.' });
    }

    res.json({ message: 'Service listing updated successfully.' });
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ message: 'Server error updating service.' });
  }
});

// @route   DELETE api/services/:id
// @desc    Delete a service listing (Own services only)
router.delete('/:id', verifyToken, requireRole(['freelancer']), async (req, res) => {
  const serviceId = req.params.id;
  const freelancerId = req.user.id;

  try {
    const result = await db.query(
      'DELETE FROM services WHERE id = ? AND freelancer_id = ?',
      [serviceId, freelancerId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service not found or unauthorized.' });
    }

    res.json({ message: 'Service listing deleted successfully.' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ message: 'Server error deleting service.' });
  }
});

module.exports = router;
