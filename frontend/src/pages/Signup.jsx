import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Signup = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'freelancer' ? 'freelancer' : 'client';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !email || !password || !confirmPassword || !role) {
      setErrorMsg('Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('You must agree to the Terms of Service.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await signup({
        full_name: fullName,
        email,
        password,
        confirmPassword,
        role
      });
      // Success redirect
      if (user.role === 'freelancer') {
        navigate('/dashboard/freelancer');
      } else {
        navigate('/dashboard/client');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="glass-panel auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join NovaMarket to scale your digital presence</p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--danger)',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            fontWeight: 500
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role selector buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => setRole('client')}
              className="btn"
              style={{
                background: role === 'client' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: role === 'client' ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                padding: '12px',
                borderRadius: '8px'
              }}
            >
              💼 Hire Talent
            </button>
            <button
              type="button"
              onClick={() => setRole('freelancer')}
              className="btn"
              style={{
                background: role === 'freelancer' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: role === 'freelancer' ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                padding: '12px',
                borderRadius: '8px'
              }}
            >
              🚀 Work as Freelancer
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ width: '18px', height: '18px', marginTop: '2px' }}
                required
              />
              <span>
                I agree to the{' '}
                <a href="#" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Terms of Service</a> and{' '}
                <a href="#" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Privacy Policy</a>.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          marginTop: '24px'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
