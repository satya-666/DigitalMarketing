import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';

export const AdminDashboard = () => {
  const { addLocalNotification } = useSocket();

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab views
  const [activeTab, setActiveTab] = useState('users');

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, servicesRes, reviewsRes, logsRes] = await Promise.all([
        axios.get('/admin/stats'),
        axios.get('/admin/users'),
        axios.get('/admin/services'),
        axios.get('/admin/reviews'),
        axios.get('/admin/logs')
      ]);

      setStats(statsRes.data);
      setUsersList(usersRes.data);
      setServicesList(servicesRes.data);
      setReviewsList(reviewsRes.data);
      setAuditLogs(logsRes.data);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('WARNING: Deleting this user will delete their profile, services, and associated projects. Continue?')) return;
    try {
      await axios.delete(`/admin/users/${userId}`);
      addLocalNotification(`Admin deleted user account ID: ${userId}`);
      fetchAdminData();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Delete this service listing from the marketplace?')) return;
    try {
      await axios.delete(`/admin/services/${serviceId}`);
      addLocalNotification(`Admin deleted service listing ID: ${serviceId}`);
      fetchAdminData();
    } catch (err) {
      console.error('Failed to delete service:', err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Remove this review rating?')) return;
    try {
      await axios.delete(`/admin/reviews/${reviewId}`);
      addLocalNotification(`Admin deleted review ID: ${reviewId}`);
      fetchAdminData();
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <p style={{ color: 'var(--text-tertiary)' }}>Loading system analytics...</p>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Admin Moderation Panel</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage accounts, remove listing spam, and check analytics</p>
      </div>

      {/* Analytics stats */}
      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon blue">👥</div>
          <div className="stat-details">
            <h3>{stats?.usersCount || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon indigo">💼</div>
          <div className="stat-details">
            <h3>{stats?.servicesCount || 0}</h3>
            <p>Total Services</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon green">💰</div>
          <div className="stat-details">
            <h3>${stats?.totalEarnings ? Number(stats.totalEarnings).toLocaleString() : '0'}</h3>
            <p>Total Earnings</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon purple">📊</div>
          <div className="stat-details">
            <h3>{stats?.projectsCount || 0}</h3>
            <p>Total Projects</p>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('users')}
          className="btn"
          style={{
            background: activeTab === 'users' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'users' ? '#ffffff' : 'var(--text-secondary)',
            padding: '10px 20px',
            fontSize: '0.9rem'
          }}
        >
          👤 User Accounts
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className="btn"
          style={{
            background: activeTab === 'services' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'services' ? '#ffffff' : 'var(--text-secondary)',
            padding: '10px 20px',
            fontSize: '0.9rem'
          }}
        >
          💼 Service Listings
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className="btn"
          style={{
            background: activeTab === 'reviews' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'reviews' ? '#ffffff' : 'var(--text-secondary)',
            padding: '10px 20px',
            fontSize: '0.9rem'
          }}
        >
          ⭐ Moderation Reviews
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className="btn"
          style={{
            background: activeTab === 'logs' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'logs' ? '#ffffff' : 'var(--text-secondary)',
            padding: '10px 20px',
            fontSize: '0.9rem'
          }}
        >
          📋 Audit Activity Logs
        </button>
      </div>

      {/* Tab contents */}
      <main className="glass-panel" style={{ padding: '32px' }}>
        
        {/* USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Manage User Accounts</h2>
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Signup Date</th>
                    <th>Banish Account</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.full_name}</td>
                      <td>{u.email}</td>
                      <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td>
                        {u.role !== 'admin' ? (
                          <button onClick={() => handleDeleteUser(u.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                            Delete Account
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Cannot Delete Admin</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Moderate Service Listings</h2>
            {servicesList.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No services listed.</p>
            ) : (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Service Title</th>
                      <th>Freelancer</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Moderate listing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicesList.map(s => (
                      <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.title}</td>
                        <td>{s.freelancer_name}</td>
                        <td>{s.category_name}</td>
                        <td>${Number(s.price).toLocaleString()}</td>
                        <td>
                          <button onClick={() => handleDeleteService(s.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                            Delete listing
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Moderate Feedback Reviews</h2>
            {reviewsList.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No reviews submitted yet.</p>
            ) : (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Buyer</th>
                      <th>Freelancer</th>
                      <th>Rating</th>
                      <th>Review Text</th>
                      <th>Delete Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewsList.map(r => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.client_name}</td>
                        <td>{r.freelancer_name}</td>
                        <td style={{ color: 'var(--warning)' }}>{'★'.repeat(r.rating)}</td>
                        <td>{r.review_text}</td>
                        <td>
                          <button onClick={() => handleDeleteReview(r.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                            Delete Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Audit Moderator Activity Logs</h2>
            {auditLogs.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No logs recorded.</p>
            ) : (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Moderator</th>
                      <th>Action Taken</th>
                      <th>Target ID</th>
                      <th>Time Stamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id}>
                        <td>{log.id}</td>
                        <td>{log.admin_name}</td>
                        <td>{log.action_logged}</td>
                        <td>{log.target_id || 'N/A'}</td>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
};
