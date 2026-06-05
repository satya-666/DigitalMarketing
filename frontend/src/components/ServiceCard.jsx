import React from 'react';
import { Link } from 'react-router-dom';

export const ServiceCard = ({ service }) => {
  const {
    id,
    title,
    price,
    category_name,
    image_url,
    freelancer_name,
    freelancer_picture,
    freelancer_rating,
    freelancer_reviews_count
  } = service;

  return (
    <div className="glass-panel glass-panel-hover service-card fade-in">
      <Link to={`/services/${id}`}>
        <img
          src={image_url || '/uploads/default-service.png'}
          alt={title}
          className="service-card-image"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500'; }}
        />
      </Link>
      
      <div className="service-card-body">
        <span className="service-card-category">{category_name}</span>
        
        <Link to={`/services/${id}`}>
          <h3 className="service-card-title">{title}</h3>
        </Link>
        
        {/* Freelancer details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0 20px 0' }}>
          <img
            src={freelancer_picture || '/uploads/default-avatar.png'}
            alt={freelancer_name}
            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
            onError={(e) => { e.target.src = 'https://picsum.photos/50/50'; }}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {freelancer_name}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '2px' }}>
            ★ {freelancer_rating ? Number(freelancer_rating).toFixed(1) : '5.0'}
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
              ({freelancer_reviews_count || 0})
            </span>
          </span>
        </div>
        
        <div className="service-card-footer">
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
              Starting At
            </span>
            <span className="service-card-price">${Number(price).toLocaleString()}</span>
          </div>
          
          <Link to={`/services/${id}`} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
