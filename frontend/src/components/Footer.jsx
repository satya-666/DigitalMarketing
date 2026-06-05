import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="glass-panel" style={{
      borderRadius: 0,
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '40px 0',
      marginTop: '60px',
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {/* Brand */}
        <div>
          <h3 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: 800 }}>
            NovaMarket
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            The premier freelance marketplace for top-tier digital marketing talent. Scale your growth with vetted experts.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: 600 }}>Explore</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <li><Link to="/services" style={{ color: 'var(--text-secondary)' }}>Marketplace Gigs</Link></li>
            <li><Link to="/services?category=seo" style={{ color: 'var(--text-secondary)' }}>SEO Consulting</Link></li>
            <li><Link to="/services?category=google-ads" style={{ color: 'var(--text-secondary)' }}>Google Ads Management</Link></li>
            <li><Link to="/services?category=website-development" style={{ color: 'var(--text-secondary)' }}>Web Development</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: 600 }}>Company</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <li><Link to="/about" style={{ color: 'var(--text-secondary)' }}>About Us</Link></li>
            <li><Link to="/contact" style={{ color: 'var(--text-secondary)' }}>Contact Support</Link></li>
            <li><a href="#" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</a></li>
            <li><a href="#" style={{ color: 'var(--text-secondary)' }}>Terms of Service</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: 600 }}>Get in Touch</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
            Email: hello@novamarket.com
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Phone: +1 (555) 019-2834
          </p>
        </div>
      </div>

      <div className="container" style={{
        borderTop: '1px solid var(--border-color)',
        paddingTop: '24px',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-tertiary)'
      }}>
        <p>&copy; {new Date().getFullYear()} NovaMarket Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};
