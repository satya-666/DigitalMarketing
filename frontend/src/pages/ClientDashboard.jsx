import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const ClientDashboard = () => {
  const { user } = useAuth();
  const { addLocalNotification } = useSocket();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeFreelancerId, setActiveFreelancerId] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchClientProjects = async () => {
      try {
        const res = await axios.get('/projects/client');
        setProjects(res.data);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClientProjects();
  }, []);

  const openReviewModal = (projectId, freelancerId) => {
    setActiveProjectId(projectId);
    setActiveFreelancerId(freelancerId);
    setRating(5);
    setReviewText('');
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      await axios.post('/reviews', {
        project_id: activeProjectId,
        rating,
        review_text: reviewText
      });

      addLocalNotification('Your project review has been submitted successfully.');
      setShowReviewModal(false);
      
      // Update local projects status to mark it reviewed (or refresh)
      const res = await axios.get('/projects/client');
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert(err.response?.data?.message || 'Error submitting review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <p style={{ color: 'var(--text-tertiary)' }}>Loading dashboard...</p>
      </div>
    );
  }

  const activeProjects = projects.filter(p => ['pending', 'accepted', 'in_progress'].includes(p.status));
  const completedProjects = projects.filter(p => p.status === 'completed');

  return (
    <div className="container fade-in">
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Client Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your active digital marketing orders</p>
      </div>

      {/* Analytics stats */}
      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon blue">💼</div>
          <div className="stat-details">
            <h3>{activeProjects.length}</h3>
            <p>Active Gigs</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-details">
            <h3>{completedProjects.length}</h3>
            <p>Completed Jobs</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon indigo">💰</div>
          <div className="stat-details">
            <h3>${projects.reduce((sum, p) => sum + Number(p.price), 0).toLocaleString()}</h3>
            <p>Total Invested</p>
          </div>
        </div>
      </div>

      {/* Active Orders Checklist */}
      <section className="glass-panel" style={{ padding: '32px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Current Hired Projects</h2>
        {activeProjects.length === 0 ? (
          <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', padding: '24px 0' }}>
            No active project orders. <Link to="/services" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Explore our services</Link> to hire marketers.
          </p>
        ) : (
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Marketing Service</th>
                  <th>Freelancer</th>
                  <th>Budget</th>
                  <th>Timeline</th>
                  <th>Current Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {activeProjects.map(project => (
                  <tr key={project.id}>
                    <td>
                      <strong>{project.service_title || 'Custom Growth Gig'}</strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                          src={project.freelancer_picture || '/uploads/default-avatar.png'}
                          alt={project.freelancer_name}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://picsum.photos/40/40'; }}
                        />
                        <Link to={`/profile/${project.freelancer_id}`} style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>
                          {project.freelancer_name}
                        </Link>
                      </div>
                    </td>
                    <td>${Number(project.price).toLocaleString()}</td>
                    <td>{project.delivery_time} Days</td>
                    <td>
                      <span className={`badge badge-${project.status}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => {
                        axios.post('/chats', { recipient_id: project.freelancer_id })
                          .then(res => navigate(`/chat?active=${res.data.chatId}`))
                          .catch(err => console.error(err));
                      }} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                        💬 Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Completed Orders Checklist */}
      <section className="glass-panel" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Order History & Reviews</h2>
        {completedProjects.length === 0 ? (
          <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', padding: '24px 0' }}>
            No completed projects.
          </p>
        ) : (
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Marketing Service</th>
                  <th>Freelancer</th>
                  <th>Cost</th>
                  <th>Completion Date</th>
                  <th>Rating Feedback</th>
                </tr>
              </thead>
              <tbody>
                {completedProjects.map(project => (
                  <tr key={project.id}>
                    <td>
                      <strong>{project.service_title || 'Custom Growth Gig'}</strong>
                    </td>
                    <td>
                      <Link to={`/profile/${project.freelancer_id}`} style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>
                        {project.freelancer_name}
                      </Link>
                    </td>
                    <td>${Number(project.price).toLocaleString()}</td>
                    <td>{new Date(project.updated_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => openReviewModal(project.id, project.freelancer_id)}
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        ⭐ Leave Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Review Dialog modal */}
      {showReviewModal && (
        <div style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0, left: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} className="fade-in">
          <div className="glass-panel" style={{ maxWidth: '480px', padding: '32px', width: '90%', background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Rate Your Freelancer</h3>
            
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label className="form-label">Star Rating (1 to 5 Stars)</label>
                <select
                  className="form-input"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value="5">★★★★★ (5 Stars)</option>
                  <option value="4">★★★★☆ (4 Stars)</option>
                  <option value="3">★★★☆☆ (3 Stars)</option>
                  <option value="2">★★☆☆☆ (2 Stars)</option>
                  <option value="1">★☆☆☆☆ (1 Star)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Review Comment</label>
                <textarea
                  className="form-input"
                  rows="4"
                  placeholder="Share details of your experience working with this marketer, outcomes achieved..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="btn btn-secondary"
                  style={{ flexGrow: 1, padding: '12px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flexGrow: 1, padding: '12px' }}
                  disabled={reviewSubmitting}
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
