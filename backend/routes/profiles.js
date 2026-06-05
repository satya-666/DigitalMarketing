const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET api/profiles/:userId
// @desc    Get profile by user ID
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await db.query(
      'SELECT u.id, u.full_name, u.email, u.role, p.bio, p.skills, p.experience, p.portfolio, p.contact_info, p.social_links, p.profile_picture, p.cover_image, p.rating, p.reviews_count FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    res.json(users[0]);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
});

// @route   PUT api/profiles
// @desc    Update own profile
router.put('/', verifyToken, async (req, res) => {
  const { bio, skills, experience, portfolio, contact_info, social_links, profile_picture, cover_image } = req.body;
  const userId = req.user.id;

  try {
    // Check if profile exists
    const profiles = await db.query('SELECT * FROM profiles WHERE user_id = ?', [userId]);
    if (profiles.length === 0) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    const currentProfile = profiles[0];

    const updatedBio = bio !== undefined ? bio : currentProfile.bio;
    const updatedSkills = skills !== undefined ? skills : currentProfile.skills;
    const updatedExperience = experience !== undefined ? experience : currentProfile.experience;
    const updatedPortfolio = portfolio !== undefined ? (typeof portfolio === 'string' ? portfolio : JSON.stringify(portfolio)) : currentProfile.portfolio;
    const updatedContact = contact_info !== undefined ? contact_info : currentProfile.contact_info;
    const updatedSocials = social_links !== undefined ? (typeof social_links === 'string' ? social_links : JSON.stringify(social_links)) : currentProfile.social_links;
    const updatedAvatar = profile_picture !== undefined ? profile_picture : currentProfile.profile_picture;
    const updatedCover = cover_image !== undefined ? cover_image : currentProfile.cover_image;

    await db.query(
      'UPDATE profiles SET bio = ?, skills = ?, experience = ?, portfolio = ?, contact_info = ?, social_links = ?, profile_picture = ?, cover_image = ? WHERE user_id = ?',
      [updatedBio, updatedSkills, updatedExperience, updatedPortfolio, updatedContact, updatedSocials, updatedAvatar, updatedCover, userId]
    );

    res.json({ message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error updating profile.' });
  }
});

// @route   POST api/profiles/upload
// @desc    Upload avatar or cover image
router.post('/upload', verifyToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

module.exports = router;
