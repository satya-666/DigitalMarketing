import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addLocalNotification } = useSocket();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [serviceRes, reviewsRes] = await Promise.all([
          axios.get(`/services/${id}`),
          axios.get(`/reviews/freelancer/${id}`) // wait, the reviews endpoint is /reviews/freelancer/:freelancerId
        ]);
        setService(serviceRes.data);
        
        // Fetch reviews again using freelancer's ID once service is loaded
        const freelancerId = serviceRes.data.freelancer_id;
        const reviewsData = await axios.get(`/reviews/freelancer/${freelancerId}`);
        setReviews(reviewsData.data);
      } catch (err) {
        console.error('Error loading service details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleContact = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // POST to `/chats` to initialize chat session
      const res = await axios.post('/chats', { recipient_id: service.freelancer_id });
      navigate(`/chat?active=${res.data.chatId}`);
    } catch (err) {
      console.error('Failed to initiate chat:', err);
    }
  };

  const handleBookService = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setBookingInProgress(true);
    try {
      await axios.post('/projects', {
        freelancer_id: service.freelancer_id,
        service_id: service.id,
        price: service.price,
        delivery_time: service.delivery_time
      });

      addLocalNotification(`Successfully booked service: ${service.title}`);
      setShowBookingModal(false);
      navigate('/dashboard/client');
    } catch (err) {
      console.error('Error booking service:', err);
      alert(err.response?.data?.message || 'Error booking service. Please try again.');
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <p style={{ color: 'var(--text-tertiary)' }}>Loading details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Service Listing Not Found</h2>
        <Link to="/services" className="btn btn-primary" style={{ marginTop: '20px' }}>Back to Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '40px', alignItems: 'start' }}>
        {/* Main Details Panel */}
        <main>
          {/* Header */}
          <span className="badge badge-in-progress" style={{ marginBottom: '12px' }}>{service.category_name}</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', lineHeight: 1.2 }}>{service.title}</h1>

          {/* Banner Image */}
          <div className="glass-panel" style={{ height: '400px', overflow: 'hidden', marginBottom: '32px' }}>
            <img
              src={service.image_url || '/uploads/default-service.png'}
              alt={service.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'; }}
            />
          </div>

          {/* Description */}
          <section className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Service Description</h2>
            <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-line', fontSize: '1.05rem', lineHeight: 1.7 }}>
              {service.description}
            </p>
          </section>

          {/* Reviews List */}
          <section className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '24px' }}>
              Reviews ({reviews.length})
            </h2>
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No reviews yet for this freelancer.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {reviews.map(review => (
                  <div key={review.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <img
                        src={review.client_picture || '/uploads/default-avatar.png'}
                        alt={review.client_name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://picsum.photos/60/60'; }}
                      />
                      <div>
                        <h4 style={{ fontSize: '0.95rem' }}>{review.client_name}</h4>
                        <span style={{ color: 'var(--warning)', fontSize: '0.8rem' }}>
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </span>
                      </div>
                      <small style={{ marginLeft: 'auto', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                        {new Date(review.created_at).toLocaleDateString()}
                      </small>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      {review.review_text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Sidebar Info & Booking Panel */}
        <aside style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Booking Card */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Standard Package</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, marginLeft: 'auto' }}>${Number(service.price).toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '28px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '16px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⏱️ <strong>{service.delivery_time} Days</strong> Delivery
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔄 Unlimited Revisions
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {user && user.role === 'freelancer' ? (
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', textAlign: 'center' }}>
                  Freelancers cannot book service packages.
                </p>
              ) : (
                <button onClick={() => setShowBookingModal(true)} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                  Continue Booking
                </button>
              )}
              <button onClick={handleContact} className="btn btn-secondary" style={{ width: '100%', padding: '14px' }}>
                💬 Contact Freelancer
              </button>
            </div>
          </div>

          {/* Freelancer Profile Summary Card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>About The Marketer</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src={service.freelancer_picture || '/uploads/default-avatar.png'}
                alt={service.freelancer_name}
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://picsum.photos/100/100'; }}
              />
              <div>
                <h4 style={{ fontSize: '1.05rem' }}>{service.freelancer_name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning)', fontSize: '0.85rem' }}>
                  ★ {service.freelancer_rating ? Number(service.freelancer_rating).toFixed(1) : '5.0'}
                  <span style={{ color: 'var(--text-tertiary)' }}>({service.freelancer_reviews_count || 0} reviews)</span>
                </div>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              {service.freelancer_bio || 'Professional marketer dedicated to client growth.'}
            </p>
            <Link to={`/profile/${service.freelancer_id}`} className="btn btn-outline" style={{ width: '100%', marginTop: '16px', padding: '10px', fontSize: '0.85rem' }}>
              View Full Profile
            </Link>
          </div>
        </aside>
      </div>

      {/* Booking confirmation modal */}
      {showBookingModal && (
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
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Confirm Order</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.95rem' }}>
              You are hiring <strong>{service.freelancer_name}</strong> for: <br />
              <strong>{service.title}</strong>
            </p>

            <table style={{ width: '100%', marginBottom: '24px', fontSize: '0.95rem', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Delivery Time:</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>{service.delivery_time} Days</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Total Price:</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent-primary)' }}>${Number(service.price).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowBookingModal(false)} className="btn btn-secondary" style={{ flexGrow: 1, padding: '12px' }}>
                Cancel
              </button>
              <button onClick={handleBookService} className="btn btn-primary" style={{ flexGrow: 1, padding: '12px' }} disabled={bookingInProgress}>
                {bookingInProgress ? 'Processing...' : 'Confirm Book'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
