import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ServiceCard } from '../components/ServiceCard';

export const ServiceList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sort, setSort] = useState('newest');

  // Trigger search on filter parameters change
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (category) queryParams.append('category', category);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (minRating) queryParams.append('minRating', minRating);
        queryParams.append('sort', sort);

        const res = await axios.get(`/services?${queryParams.toString()}`);
        setServices(res.data);
      } catch (err) {
        console.error('Error fetching services list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [search, category, minPrice, maxPrice, minRating, sort]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/services/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div className="container fade-in" style={{ paddingTop: '20px' }}>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Explore Marketing Services</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Work with professional creators, strategists, and consultants
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Filters Sidebar */}
        <aside className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
          <div className="flex-between" style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Filter Options</h3>
            <button onClick={clearFilters} style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-primary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}>
              Clear All
            </button>
          </div>

          {/* Search */}
          <div className="form-group">
            <label className="form-label">Search Keywords</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. SEO audit, logo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="form-group">
            <label className="form-label">Price Range ($)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input
                type="number"
                className="form-input"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                className="form-input"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Ratings */}
          <div className="form-group">
            <label className="form-label">Min Rating</label>
            <select
              className="form-input"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5 ★ & above</option>
              <option value="4.0">4.0 ★ & above</option>
              <option value="3.5">3.5 ★ & above</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="form-group">
            <label className="form-label">Sort By</label>
            <select
              className="form-input"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest Listings</option>
              <option value="highest_rated">Highest Rated</option>
              <option value="lowest_price">Price: Low to High</option>
              <option value="highest_price">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Listings Content */}
        <main>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
              <p style={{ color: 'var(--text-tertiary)' }}>Loading marketing services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
              <span style={{ fontSize: '3rem' }}>🔍</span>
              <h3 style={{ marginTop: '16px', marginBottom: '8px' }}>No Listings Found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Try adjusting your search terms or filters to locate marketing services.
              </p>
              <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={clearFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 500 }}>
                Showing {services.length} services
              </p>
              <div className="card-grid" style={{ marginTop: 0 }}>
                {services.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
