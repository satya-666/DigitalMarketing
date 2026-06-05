import React from 'react';
import { Link } from 'react-router-dom';

export const AboutUs = () => {
  return (
    <div className="container fade-in" style={{ paddingBottom: '60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '60px' }}>
        <span className="badge badge-accepted" style={{ marginBottom: '16px' }}>About Our Platform</span>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>
          Redefining <span className="text-gradient">Digital Marketing</span> Partnerships
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.6 }}>
          NovaMarket is a niche freelance ecosystem built specifically for digital growth marketers, growth hackers, copywriters, and developers.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
        
        {/* Story */}
        <section className="glass-panel" style={{ padding: '40px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '16px' }}>Our Mission</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '1.05rem' }}>
              Finding the right marketing talent shouldn't feel like a lottery. Traditional freelance sites host massive pools of generalists, making it incredibly difficult for businesses to source specialized growth experts.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              We started NovaMarket to bridge this gap. By vetting specialists across SEO, PPC, email, design, and content creation, we build a secure channel for businesses to find growth partners and execute campaigns with full transparency.
            </p>
          </div>
          <div style={{ height: '300px', borderRadius: '12px', overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500" alt="Team Work" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </section>

        {/* Pillars */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Vetted Talent</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Every freelancer goes through an intensive portfolio and skills audit before being allowed to list services on the marketplace.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Secured Milestone Hiring</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              We keep client payments securely inside booking milestones, transferring funds only when the client reviews and accepts deliverables.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Real-time Collaboration</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              With built-in live chats, file attachments, and status checkpoints, communicating with your freelancer has never been easier.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};
