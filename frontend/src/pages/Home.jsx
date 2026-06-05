import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ServiceCard } from '../components/ServiceCard';

export const Home = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          axios.get('/services?limit=4'),
          axios.get('/services/categories')
        ]);
        // Get up to 4 services for homepage showcase
        setFeaturedServices(servicesRes.data.slice(0, 4));
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="fade-in">
      {/* 1. HERO SECTION */}
      <section style={{
        padding: '80px 0 100px 0',
        background: 'radial-gradient(circle at 80% 20%, rgba(var(--accent-primary-rgb), 0.08) 0%, transparent 50%)',
        position: 'relative'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '40px',
          alignItems: 'center'
        }}>
          <div>
            <span className="badge badge-accepted" style={{ marginBottom: '16px' }}>Vetted Digital Marketing Pros Only</span>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: 800,
              letterSpacing: '-1.5px',
              marginBottom: '24px',
              lineHeight: 1.1
            }}>
              Find the perfect <span className="text-gradient">Digital Marketing</span> talent to grow your business.
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              marginBottom: '40px',
              maxWidth: '600px'
            }}>
              Connect with specialized experts in SEO, Paid Ads, Copywriting, Social Media, and more. Transparent pricing. Secured delivery.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link to="/services" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1rem' }}>
                Explore Marketplace
              </Link>
              <Link to="/signup?role=freelancer" className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '1rem' }}>
                Join as Freelancer
              </Link>
            </div>
          </div>

          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{
              width: '100%',
              maxWidth: '400px',
              height: '350px',
              overflow: 'hidden',
              transform: 'rotate(2deg)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600"
                alt="Marketing Team"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {/* Float visual bubble */}
            <div className="glass-panel" style={{
              position: 'absolute',
              bottom: '-20px',
              left: '-20px',
              padding: '16px 24px',
              borderRadius: '12px',
              transform: 'rotate(-4deg)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🚀</span>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>300%+ Growth</h4>
                <small style={{ color: 'var(--text-secondary)' }}>Avg. campaign ROAS</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES GRID */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', marginBottom: '12px', textAlign: 'center' }}>Browse by Specialization</h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '40px' }}>
            Direct access to specialized expertise for every marketing channel.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px'
          }}>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/services?category=${cat.slug}`}
                className="glass-panel glass-panel-hover"
                style={{
                  padding: '24px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span style={{
                  fontSize: '2rem',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(var(--accent-primary-rgb), 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)'
                }}>
                  💼
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES */}
      <section style={{ padding: '60px 0', background: 'var(--bg-tertiary)' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Trending Marketing Services</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Vetted marketing strategies ready to execute today.</p>
            </div>
            <Link to="/services" className="btn btn-outline">View All Gigs</Link>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>Loading services...</p>
          ) : featuredServices.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>No services listed yet.</p>
          ) : (
            <div className="card-grid">
              {featuredServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. VALUE PROPOSITION */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px'
        }}>
          <div className="glass-panel" style={{ padding: '32px' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '16px' }}>🛡️</span>
            <h3 style={{ marginBottom: '12px' }}>Vetted Specialists</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              We review every digital marketer's portfolio, track record, and credentials so you work only with absolute experts.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '16px' }}>💬</span>
            <h3 style={{ marginBottom: '12px' }}>Real-time Sync</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Chat directly with your provider, share documents, track order status updates, and approve deliverables in one dashboard.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '16px' }}>📈</span>
            <h3 style={{ marginBottom: '12px' }}>Zero Hidden Costs</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Agree on fixed milestones and prices upfront. Funds are held securely and released only when work is completed.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
