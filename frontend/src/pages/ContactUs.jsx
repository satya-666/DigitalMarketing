import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';

export const ContactUs = () => {
  const { addLocalNotification } = useSocket();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Simulate successful API submission
    setSubmitted(true);
    addLocalNotification('Your support inquiry has been submitted (simulated).');
    
    // Clear form
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="container fade-in" style={{ paddingBottom: '60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '40px' }}>
        <span className="badge badge-accepted" style={{ marginBottom: '16px' }}>Help & Support</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
          We'd Love to Hear From You
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Have questions about pricing, vetting, or features? Reach out and our team will get back to you shortly.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '40px', alignItems: 'start', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Support Information */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Customer Support</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px' }}>
              Our dedicated moderation and dispute support teams are online 24/7 to review platform issues.
            </p>
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>📧 support@novamarket.com</p>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Sales & Partnerships</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px' }}>
              Want to run enterprise-scale marketing campaigns or partner with NovaMarket?
            </p>
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>📧 corporate@novamarket.com</p>
          </div>
        </aside>

        {/* Contact Form */}
        <main className="glass-panel" style={{ padding: '40px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <span style={{ fontSize: '3rem' }}>✉️</span>
              <h3 style={{ marginTop: '16px', marginBottom: '12px' }}>Message Received</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Thank you for contacting support! A ticketing representative has been assigned to your request and will follow up shortly.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn btn-secondary">
                Submit Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="How can we help?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message Details</label>
                <textarea
                  className="form-input"
                  rows="5"
                  placeholder="Detail your inquiry..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                ✉️ Send Message
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};
