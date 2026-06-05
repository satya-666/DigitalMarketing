import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const FreelancerDashboard = () => {
  const { user } = useAuth();
  const { addLocalNotification } = useSocket();

  const [projects, setProjects] = useState([]);
  const [myServices, setMyServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Service Form State
  const [showAddService, setShowAddService] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('/uploads/default-service.png');
  const [submittingService, setSubmittingService] = useState(false);

  const fetchData = async () => {
    try {
      const [projectsRes, servicesRes, categoriesRes] = await Promise.all([
        axios.get('/projects/freelancer'),
        axios.get(`/services?freelancer_id=${user.id}`), // will retrieve all but filter down to own
        axios.get('/services/categories')
      ]);

      setProjects(projectsRes.data);
      // Filter services listed by this freelancer specifically
      const ownServices = servicesRes.data.filter(s => s.freelancer_id === user.id);
      setMyServices(ownServices);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const handleStatusUpdate = async (projectId, nextStatus) => {
    try {
      await axios.put(`/projects/${projectId}/status`, { status: nextStatus });
      addLocalNotification(`Project status updated to ${nextStatus}.`);
      fetchData();
    } catch (err) {
      console.error('Status update failed:', err);
      alert('Error updating status.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('/profiles/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImageUrl(res.data.url);
    } catch (err) {
      console.error('Cover upload failed:', err);
    }
  };

  const handleAddServiceSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !price || !deliveryTime || !categoryId) {
      alert('Please fill out all fields.');
      return;
    }

    setSubmittingService(true);
    try {
      await axios.post('/services', {
        title,
        description,
        price: Number(price),
        delivery_time: Number(deliveryTime),
        category_id: Number(categoryId),
        image_url: imageUrl
      });

      addLocalNotification(`New service created: ${title}`);
      
      // Reset form fields
      setTitle('');
      setDescription('');
      setPrice('');
      setDeliveryTime('');
      setCategoryId('');
      setImageUrl('/uploads/default-service.png');
      setShowAddService(false);

      fetchData();
    } catch (err) {
      console.error('Failed to create service listing:', err);
      alert(err.response?.data?.message || 'Error listing service.');
    } finally {
      setSubmittingService(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await axios.delete(`/services/${serviceId}`);
      addLocalNotification('Service listing deleted.');
      fetchData();
    } catch (err) {
      console.error('Service deletion failed:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <p style={{ color: 'var(--text-tertiary)' }}>Loading freelancer dashboard...</p>
      </div>
    );
  }

  const activeProjects = projects.filter(p => ['pending', 'accepted', 'in_progress'].includes(p.status));
  const completedProjects = projects.filter(p => p.status === 'completed');
  const totalEarnings = completedProjects.reduce((sum, p) => sum + Number(p.price), 0);

  return (
    <div className="container fade-in">
      <div className="flex-between" style={{ marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Freelancer Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your digital marketing gigs, orders, and sales</p>
        </div>
        <button onClick={() => setShowAddService(!showAddService)} className="btn btn-primary">
          {showAddService ? '✕ Close Gig Creator' : '➕ Create New Service'}
        </button>
      </div>

      {/* Analytics stats */}
      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon blue">💼</div>
          <div className="stat-details">
            <h3>{activeProjects.length}</h3>
            <p>Active Orders</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-details">
            <h3>{completedProjects.length}</h3>
            <p>Jobs Completed</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon indigo">💰</div>
          <div className="stat-details">
            <h3>${totalEarnings.toLocaleString()}</h3>
            <p>Gross Earnings</p>
          </div>
        </div>
      </div>

      {/* Service Gig Creator form */}
      {showAddService && (
        <section className="glass-panel fade-in" style={{ padding: '32px', marginBottom: '40px', border: '2px solid var(--accent-primary)' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '24px' }}>Marketplace Service Creator</h2>
          <form onSubmit={handleAddServiceSubmit}>
            <div className="form-group">
              <label className="form-label">Service Title</label>
              <input type="text" className="form-input" placeholder="e.g. Complete On-Page SEO Campaign for Small Business" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '20px' }} className="form-row">
              <div className="form-group">
                <label className="form-label">Specialization Category</label>
                <select className="form-input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Pricing Base ($)</label>
                <input type="number" className="form-input" placeholder="150" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Timeline (Days)</label>
                <input type="number" className="form-input" placeholder="7" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description</label>
              <textarea className="form-input" rows="5" placeholder="Explain what tasks are included in this service, deliverables, platforms optimized..." value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Service Cover Image</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src={imageUrl} alt="Service Cover" style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                <label className="btn btn-secondary" style={{ padding: '10px 16px', fontSize: '0.85rem' }}>
                  📂 Upload Photo
                  <input type="file" onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }} disabled={submittingService}>
              {submittingService ? 'Publishing...' : '🚀 Publish Service'}
            </button>
          </form>
        </section>
      )}

      {/* Orders Management checklist */}
      <section className="glass-panel" style={{ padding: '32px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Incoming Order Requests</h2>
        {activeProjects.length === 0 ? (
          <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', padding: '24px 0' }}>
            No active orders to complete.
          </p>
        ) : (
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Marketing Service</th>
                  <th>Client</th>
                  <th>Payout</th>
                  <th>Current Status</th>
                  <th>Modify Status</th>
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
                          src={project.client_picture || '/uploads/default-avatar.png'}
                          alt={project.client_name}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://picsum.photos/40/40'; }}
                        />
                        <Link to={`/profile/${project.client_id}`} style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>
                          {project.client_name}
                        </Link>
                      </div>
                    </td>
                    <td>${Number(project.price).toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-${project.status}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {project.status === 'pending' && (
                          <>
                            <button onClick={() => handleStatusUpdate(project.id, 'accepted')} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                              Accept
                            </button>
                            <button onClick={() => handleStatusUpdate(project.id, 'rejected')} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                              Reject
                            </button>
                          </>
                        )}
                        {project.status === 'accepted' && (
                          <button onClick={() => handleStatusUpdate(project.id, 'in_progress')} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                            Start Work
                          </button>
                        )}
                        {project.status === 'in_progress' && (
                          <button onClick={() => handleStatusUpdate(project.id, 'completed')} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--success)' }}>
                            Complete Job
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Listed Services panel */}
      <section className="glass-panel" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Active Gig Listings ({myServices.length})</h2>
        {myServices.length === 0 ? (
          <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', padding: '24px 0' }}>
            You have not listed any marketing services yet.
          </p>
        ) : (
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Cover Photo</th>
                  <th>Service Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Timeline</th>
                  <th>Banish Listing</th>
                </tr>
              </thead>
              <tbody>
                {myServices.map(service => (
                  <tr key={service.id}>
                    <td>
                      <img src={service.image_url} alt="Cover" style={{ width: '60px', height: '45px', borderRadius: '4px', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://picsum.photos/60/45'; }} />
                    </td>
                    <td>
                      <Link to={`/services/${service.id}`} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {service.title}
                      </Link>
                    </td>
                    <td>{service.category_name}</td>
                    <td>${Number(service.price).toLocaleString()}</td>
                    <td>{service.delivery_time} Days</td>
                    <td>
                      <button onClick={() => handleDeleteService(service.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
};
