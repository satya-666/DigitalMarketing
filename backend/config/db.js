const mysql = require('mysql2/promise');
require('dotenv').config();

const useMockDb = process.env.USE_MOCK_DB === 'true';
let pool = null;

// Initial Mock Database State
const mockDb = {
  users: [
    { id: 1, full_name: 'System Admin', email: 'admin@marketplace.com', password: '$2a$10$wKlhT5h1k6e3d2.kQ/WlkuG1.jV5Y2lqXh1uX1uX1uX1uX1uX1uX1', role: 'admin', created_at: new Date() }, // pwd: adminpassword
    { id: 2, full_name: 'Alex Freelancer', email: 'alex@marketing.com', password: '$2a$10$wKlhT5h1k6e3d2.kQ/WlkuG1.jV5Y2lqXh1uX1uX1uX1uX1uX1uX1', role: 'freelancer', created_at: new Date() }, // pwd: adminpassword
    { id: 3, full_name: 'Sophia Client', email: 'sophia@client.com', password: '$2a$10$wKlhT5h1k6e3d2.kQ/WlkuG1.jV5Y2lqXh1uX1uX1uX1uX1uX1uX1', role: 'client', created_at: new Date() } // pwd: adminpassword
  ],
  profiles: [
    {
      id: 1,
      user_id: 1,
      bio: 'Marketplace Administrator',
      skills: 'Management, Moderation, Analytics',
      experience: '5 years managing platforms',
      portfolio: '[]',
      contact_info: 'admin@marketplace.com',
      social_links: '{}',
      profile_picture: '/uploads/default-avatar.png',
      cover_image: '/uploads/default-cover.png',
      rating: 5.0,
      reviews_count: 0
    },
    {
      id: 2,
      user_id: 2,
      bio: 'Senior SEO Consultant & Digital Marketing Expert with 8+ years of experience helping brands scale.',
      skills: 'SEO, Google Ads, Content Marketing, Link Building',
      experience: 'Freelancing for 5 years, previously Head of Growth at Tech Corp.',
      portfolio: JSON.stringify([
        { title: 'SaaS Traffic Growth by 300%', url: 'https://example.com', description: 'Increased organic search traffic for a B2B SaaS startup.' },
        { title: 'E-commerce Brand Campaign', url: 'https://example.com', description: 'Managed $50k monthly ad spend resulting in 4.5x ROAS.' }
      ]),
      contact_info: 'alex@marketing.com',
      social_links: JSON.stringify({ linkedin: 'linkedin.com/in/alex', twitter: 'twitter.com/alexseo', website: 'alexseo.com' }),
      profile_picture: '/uploads/default-avatar.png',
      cover_image: '/uploads/default-cover.png',
      rating: 4.8,
      reviews_count: 2
    },
    {
      id: 3,
      user_id: 3,
      bio: 'Product Manager looking to hire top-tier marketing specialists.',
      skills: 'Product Management, Venture Capital',
      experience: 'Looking for freelance talent',
      portfolio: '[]',
      contact_info: 'sophia@client.com',
      social_links: JSON.stringify({ linkedin: 'linkedin.com/in/sophia' }),
      profile_picture: '/uploads/default-avatar.png',
      cover_image: '/uploads/default-cover.png',
      rating: 5.0,
      reviews_count: 0
    }
  ],
  categories: [
    { id: 1, name: 'SEO Optimization', slug: 'seo' },
    { id: 2, name: 'Social Media Marketing', slug: 'social-media-marketing' },
    { id: 3, name: 'Content Writing', slug: 'content-writing' },
    { id: 4, name: 'Email Marketing', slug: 'email-marketing' },
    { id: 5, name: 'Google Ads Management', slug: 'google-ads' },
    { id: 6, name: 'Facebook Ads Management', slug: 'facebook-ads' },
    { id: 7, name: 'Graphic Design', slug: 'graphic-design' },
    { id: 8, name: 'Video Editing', slug: 'video-editing' },
    { id: 9, name: 'Website Development', slug: 'website-development' }
  ],
  services: [
    { id: 1, freelancer_id: 2, category_id: 1, title: 'Complete SEO Strategy & Backlink Campaign', description: 'I will analyze your website, optimize on-page SEO, design a detailed backlinking strategy, and execute content optimization to rank you on Page 1.', price: 299.00, delivery_time: 14, image_url: '/uploads/default-service.png', created_at: new Date() },
    { id: 2, freelancer_id: 2, category_id: 5, title: 'High-Converting Google Ads Setup & Optimization', description: 'Get professional setup of your Google search & display campaigns. Includes negative keywords research, ad copywriting, and landing page optimization suggestions.', price: 150.00, delivery_time: 7, image_url: '/uploads/default-service.png', created_at: new Date() }
  ],
  projects: [
    { id: 1, client_id: 3, freelancer_id: 2, service_id: 1, status: 'completed', price: 299.00, delivery_time: 14, created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), updated_at: new Date() },
    { id: 2, client_id: 3, freelancer_id: 2, service_id: 2, status: 'in_progress', price: 150.00, delivery_time: 7, created_at: new Date(), updated_at: new Date() }
  ],
  chats: [
    { id: 1, client_id: 3, freelancer_id: 2, created_at: new Date() }
  ],
  messages: [
    { id: 1, chat_id: 1, sender_id: 3, message_text: 'Hi Alex! I just booked your Google Ads service. Excited to work together!', is_read: true, created_at: new Date(Date.now() - 100000) },
    { id: 2, chat_id: 1, sender_id: 2, message_text: 'Hi Sophia! Thank you for the order. I am starting the keyword research today.', is_read: false, created_at: new Date(Date.now() - 50000) }
  ],
  reviews: [
    { id: 1, project_id: 1, client_id: 3, freelancer_id: 2, rating: 5, review_text: 'Excellent work! My traffic doubled in less than a month. Highly recommended.', created_at: new Date() }
  ],
  notifications: [
    { id: 1, user_id: 2, content: 'You received a new order from Sophia Client', is_read: false, created_at: new Date() }
  ],
  admin: [
    { id: 1, admin_user_id: 1, action_logged: 'System initialized in Mock DB mode', target_id: null, timestamp: new Date() }
  ]
};

let userCounter = 4;
let profileCounter = 4;
let serviceCounter = 3;
let projectCounter = 3;
let chatCounter = 2;
let messageCounter = 3;
let reviewCounter = 2;
let notificationCounter = 2;
let adminCounter = 2;

// Initialize MySQL pool if mock DB is disabled
if (!useMockDb) {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'digital_marketing_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log('MySQL Connection Pool created successfully.');
  } catch (err) {
    console.error('Failed to connect to MySQL database. Running in Mock DB mode fallback.', err);
  }
} else {
  console.log('Running backend in Mock Database mode.');
}

async function query(sql, params = []) {
  if (useMockDb || !pool) {
    return runMockQuery(sql, params);
  }
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (err) {
    console.error(`Database Query Error: ${err.message}. Query: ${sql}`);
    throw err;
  }
}

// Simulated SQL Engine for Mock DB
function runMockQuery(sql, params) {
  const normalizedSql = sql.trim().replace(/\s+/g, ' ');

  // 1. SELECT * FROM users WHERE email = ?
  if (normalizedSql.match(/SELECT \* FROM users WHERE email\s*=\s*\?/i)) {
    const user = mockDb.users.find(u => u.email.toLowerCase() === params[0].toLowerCase());
    return user ? [user] : [];
  }

  // 2. INSERT INTO users
  if (normalizedSql.match(/INSERT INTO users\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i)) {
    const newUser = {
      id: userCounter++,
      full_name: params[0],
      email: params[1],
      password: params[2],
      role: params[3],
      created_at: new Date()
    };
    mockDb.users.push(newUser);
    return { insertId: newUser.id };
  }

  // 3. SELECT FROM users JOIN profiles ON users.id = profiles.user_id WHERE users.id = ?
  if (normalizedSql.match(/SELECT u\.\*, p\.\* FROM users u LEFT JOIN profiles p/i)) {
    const userId = params[0];
    const user = mockDb.users.find(u => u.id === Number(userId));
    if (!user) return [];
    const profile = mockDb.profiles.find(p => p.user_id === Number(userId)) || {};
    return [{ ...user, ...profile }];
  }

  // 4. SELECT * FROM users WHERE id = ?
  if (normalizedSql.match(/SELECT \* FROM users WHERE id\s*=\s*\?/i)) {
    const user = mockDb.users.find(u => u.id === Number(params[0]));
    return user ? [user] : [];
  }

  // 5. INSERT INTO profiles
  if (normalizedSql.match(/INSERT INTO profiles/i)) {
    const newProfile = {
      id: profileCounter++,
      user_id: params[0],
      bio: params[1],
      skills: params[2],
      experience: params[3],
      portfolio: params[4],
      contact_info: params[5],
      social_links: params[6],
      profile_picture: params[7] || '/uploads/default-avatar.png',
      cover_image: params[8] || '/uploads/default-cover.png',
      rating: 5.0,
      reviews_count: 0
    };
    mockDb.profiles.push(newProfile);
    return { insertId: newProfile.id };
  }

  // 6. UPDATE profiles SET ... WHERE user_id = ?
  if (normalizedSql.match(/UPDATE profiles SET bio/i)) {
    // params: bio, skills, experience, portfolio, contact_info, social_links, profile_picture, cover_image, user_id
    const userId = Number(params[8]);
    const idx = mockDb.profiles.findIndex(p => p.user_id === userId);
    if (idx !== -1) {
      mockDb.profiles[idx] = {
        ...mockDb.profiles[idx],
        bio: params[0],
        skills: params[1],
        experience: params[2],
        portfolio: params[3],
        contact_info: params[4],
        social_links: params[5],
        profile_picture: params[6],
        cover_image: params[7]
      };
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // 7. SELECT * FROM categories
  if (normalizedSql.match(/SELECT \* FROM categories/i)) {
    return mockDb.categories;
  }

  // 8. INSERT INTO services
  if (normalizedSql.match(/INSERT INTO services/i)) {
    const newService = {
      id: serviceCounter++,
      freelancer_id: params[0],
      category_id: params[1],
      title: params[2],
      description: params[3],
      price: Number(params[4]),
      delivery_time: Number(params[5]),
      image_url: params[6] || '/uploads/default-service.png',
      created_at: new Date()
    };
    mockDb.services.push(newService);
    return { insertId: newService.id };
  }

  // 9. SELECT services WITH JOINS (All / Specific service / Filters)
  if (normalizedSql.match(/SELECT s\.\*, c\.name as category_name/i)) {
    let result = mockDb.services.map(s => {
      const cat = mockDb.categories.find(c => c.id === s.category_id) || {};
      const freelancer = mockDb.users.find(u => u.id === s.freelancer_id) || {};
      const profile = mockDb.profiles.find(p => p.user_id === s.freelancer_id) || {};
      return {
        ...s,
        category_name: cat.name || 'Uncategorized',
        freelancer_name: freelancer.full_name || 'Unknown',
        freelancer_picture: profile.profile_picture || '/uploads/default-avatar.png',
        freelancer_rating: profile.rating || 5.00,
        freelancer_reviews_count: profile.reviews_count || 0
      };
    });

    // Check filters inside routes or process query filters:
    // If querying a single service ID:
    if (normalizedSql.includes('s.id = ?')) {
      const filtered = result.filter(s => s.id === Number(params[0]));
      return filtered;
    }
    // If querying by freelancer_id:
    if (normalizedSql.includes('s.freelancer_id = ?')) {
      return result.filter(s => s.freelancer_id === Number(params[0]));
    }
    // General filters are usually handled in routing code but we will also filter here:
    return result;
  }

  // 10. UPDATE services
  if (normalizedSql.match(/UPDATE services SET/i)) {
    // params: title, description, price, delivery_time, category_id, image_url, id, freelancer_id
    const id = Number(params[6]);
    const fId = Number(params[7]);
    const idx = mockDb.services.findIndex(s => s.id === id && s.freelancer_id === fId);
    if (idx !== -1) {
      mockDb.services[idx] = {
        ...mockDb.services[idx],
        title: params[0],
        description: params[1],
        price: Number(params[2]),
        delivery_time: Number(params[3]),
        category_id: Number(params[4]),
        image_url: params[5]
      };
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // 11. DELETE FROM services
  if (normalizedSql.match(/DELETE FROM services WHERE/i)) {
    const id = Number(params[0]);
    const fId = Number(params[1]);
    const initialLen = mockDb.services.length;
    mockDb.services = mockDb.services.filter(s => !(s.id === id && s.freelancer_id === fId));
    return { affectedRows: initialLen - mockDb.services.length };
  }

  // 12. INSERT INTO projects
  if (normalizedSql.match(/INSERT INTO projects/i)) {
    // params: client_id, freelancer_id, service_id, price, delivery_time
    const newProject = {
      id: projectCounter++,
      client_id: params[0],
      freelancer_id: params[1],
      service_id: params[2],
      price: Number(params[3]),
      delivery_time: Number(params[4]),
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date()
    };
    mockDb.projects.push(newProject);
    return { insertId: newProject.id };
  }

  // 13. SELECT projects WITH JOINS
  if (normalizedSql.match(/SELECT p\.\*, s\.title/i)) {
    let result = mockDb.projects.map(p => {
      const service = mockDb.services.find(s => s.id === p.service_id) || {};
      const client = mockDb.users.find(u => u.id === p.client_id) || {};
      const freelancer = mockDb.users.find(u => u.id === p.freelancer_id) || {};
      return {
        ...p,
        service_title: service.title || 'Custom Gig',
        client_name: client.full_name || 'Client',
        freelancer_name: freelancer.full_name || 'Freelancer'
      };
    });

    if (normalizedSql.includes('p.client_id = ?')) {
      return result.filter(p => p.client_id === Number(params[0]));
    }
    if (normalizedSql.includes('p.freelancer_id = ?')) {
      return result.filter(p => p.freelancer_id === Number(params[0]));
    }
    if (normalizedSql.includes('p.id = ?')) {
      return result.filter(p => p.id === Number(params[0]));
    }
    return result;
  }

  // 14. UPDATE projects status
  if (normalizedSql.match(/UPDATE projects SET status/i)) {
    // params: status, id
    const status = params[0];
    const id = Number(params[1]);
    const idx = mockDb.projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      mockDb.projects[idx].status = status;
      mockDb.projects[idx].updated_at = new Date();
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // 15. CHATS
  if (normalizedSql.match(/SELECT \* FROM chats WHERE/i)) {
    if (normalizedSql.includes('client_id = ? AND freelancer_id = ?')) {
      const chat = mockDb.chats.find(c => c.client_id === Number(params[0]) && c.freelancer_id === Number(params[1]));
      return chat ? [chat] : [];
    }
    if (normalizedSql.includes('id = ?')) {
      const chat = mockDb.chats.find(c => c.id === Number(params[0]));
      return chat ? [chat] : [];
    }
  }

  if (normalizedSql.match(/INSERT INTO chats/i)) {
    const newChat = {
      id: chatCounter++,
      client_id: params[0],
      freelancer_id: params[1],
      created_at: new Date()
    };
    mockDb.chats.push(newChat);
    return { insertId: newChat.id };
  }

  if (normalizedSql.match(/SELECT c\.\*, u\.full_name/i)) {
    // fetch user chats
    const userId = Number(params[0]);
    const myChats = mockDb.chats.filter(c => c.client_id === userId || c.freelancer_id === userId);
    return myChats.map(c => {
      const otherUserRole = c.client_id === userId ? 'freelancer' : 'client';
      const otherUserId = c.client_id === userId ? c.freelancer_id : c.client_id;
      const otherUser = mockDb.users.find(u => u.id === otherUserId) || {};
      const profile = mockDb.profiles.find(p => p.user_id === otherUserId) || {};
      return {
        ...c,
        recipient_id: otherUserId,
        recipient_name: otherUser.full_name || 'User',
        recipient_picture: profile.profile_picture || '/uploads/default-avatar.png',
        recipient_role: otherUserRole
      };
    });
  }

  // 16. MESSAGES
  if (normalizedSql.match(/SELECT m\.\*, u\.full_name/i)) {
    const chatId = Number(params[0]);
    const msgs = mockDb.messages.filter(m => m.chat_id === chatId);
    return msgs.map(m => {
      const user = mockDb.users.find(u => u.id === m.sender_id) || {};
      return {
        ...m,
        sender_name: user.full_name || 'Sender'
      };
    });
  }

  if (normalizedSql.match(/INSERT INTO messages/i)) {
    const newMsg = {
      id: messageCounter++,
      chat_id: params[0],
      sender_id: params[1],
      message_text: params[2],
      is_read: false,
      created_at: new Date()
    };
    mockDb.messages.push(newMsg);
    return { insertId: newMsg.id };
  }

  if (normalizedSql.match(/UPDATE messages SET is_read = true WHERE chat_id = \?/i)) {
    const chatId = Number(params[0]);
    mockDb.messages.forEach(m => {
      if (m.chat_id === chatId && m.sender_id !== Number(params[1])) {
        m.is_read = true;
      }
    });
    return { affectedRows: 1 };
  }

  // 17. REVIEWS
  if (normalizedSql.match(/INSERT INTO reviews/i)) {
    const newReview = {
      id: reviewCounter++,
      project_id: params[0],
      client_id: params[1],
      freelancer_id: params[2],
      rating: params[3],
      review_text: params[4],
      created_at: new Date()
    };
    mockDb.reviews.push(newReview);

    // Update freelancer's profile reviews counts and rating
    const fId = Number(params[2]);
    const freelancerReviews = mockDb.reviews.filter(r => r.freelancer_id === fId);
    const totalRating = freelancerReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / freelancerReviews.length;
    const profIdx = mockDb.profiles.findIndex(p => p.user_id === fId);
    if (profIdx !== -1) {
      mockDb.profiles[profIdx].rating = Number(avgRating.toFixed(2));
      mockDb.profiles[profIdx].reviews_count = freelancerReviews.length;
    }
    return { insertId: newReview.id };
  }

  if (normalizedSql.match(/SELECT r\.\*, u\.full_name/i)) {
    const fId = Number(params[0]);
    const freelancerReviews = mockDb.reviews.filter(r => r.freelancer_id === fId);
    return freelancerReviews.map(r => {
      const user = mockDb.users.find(u => u.id === r.client_id) || {};
      const profile = mockDb.profiles.find(p => p.user_id === r.client_id) || {};
      return {
        ...r,
        client_name: user.full_name || 'Client',
        client_picture: profile.profile_picture || '/uploads/default-avatar.png'
      };
    });
  }

  // 18. NOTIFICATIONS
  if (normalizedSql.match(/INSERT INTO notifications/i)) {
    const newNotif = {
      id: notificationCounter++,
      user_id: params[0],
      content: params[1],
      is_read: false,
      created_at: new Date()
    };
    mockDb.notifications.push(newNotif);
    return { insertId: newNotif.id };
  }

  if (normalizedSql.match(/SELECT \* FROM notifications WHERE user_id/i)) {
    const userId = Number(params[0]);
    return mockDb.notifications.filter(n => n.user_id === userId).sort((a,b) => b.created_at - a.created_at);
  }

  if (normalizedSql.match(/UPDATE notifications SET is_read = true WHERE user_id/i)) {
    const userId = Number(params[0]);
    mockDb.notifications.forEach(n => {
      if (n.user_id === userId) n.is_read = true;
    });
    return { affectedRows: 1 };
  }

  // 19. ADMIN LOGS & MODERATION
  if (normalizedSql.match(/INSERT INTO admin/i)) {
    const newAdminLog = {
      id: adminCounter++,
      admin_user_id: params[0],
      action_logged: params[1],
      target_id: params[2],
      timestamp: new Date()
    };
    mockDb.admin.push(newAdminLog);
    return { insertId: newAdminLog.id };
  }

  if (normalizedSql.match(/SELECT a\.\*, u\.full_name/i)) {
    return mockDb.admin.map(a => {
      const user = mockDb.users.find(u => u.id === a.admin_user_id) || {};
      return {
        ...a,
        admin_name: user.full_name || 'Admin'
      };
    }).sort((a,b) => b.timestamp - a.timestamp);
  }

  // BANS & DELETIONS FOR ADMIN
  if (normalizedSql.match(/DELETE FROM users WHERE id/i)) {
    const userId = Number(params[0]);
    mockDb.users = mockDb.users.filter(u => u.id !== userId);
    mockDb.profiles = mockDb.profiles.filter(p => p.user_id !== userId);
    mockDb.services = mockDb.services.filter(s => s.freelancer_id !== userId);
    return { affectedRows: 1 };
  }

  if (normalizedSql.match(/DELETE FROM services WHERE id = \?/i)) {
    const serviceId = Number(params[0]);
    mockDb.services = mockDb.services.filter(s => s.id !== serviceId);
    return { affectedRows: 1 };
  }

  if (normalizedSql.match(/DELETE FROM reviews WHERE id = \?/i)) {
    const reviewId = Number(params[0]);
    mockDb.reviews = mockDb.reviews.filter(r => r.id !== reviewId);
    return { affectedRows: 1 };
  }

  // Fallback if the query is not matched
  console.log(`Unmatched Mock DB Query: ${normalizedSql}`);
  return [];
}

module.exports = {
  query,
  pool,
  isMock: useMockDb || !pool,
  mockDb
};
