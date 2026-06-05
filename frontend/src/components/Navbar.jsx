import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadNotifications, markNotificationsAsRead } = useSocket();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useRef(useNavigate());
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogoutClick = () => {
    logout();
    navigate.current('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'freelancer') return '/dashboard/freelancer';
    return '/dashboard/client';
  };

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '16px 0',
      marginBottom: '20px'
    }}>
      <div className="container flex-between">
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '1.6rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            letterSpacing: '-0.5px'
          }} className="text-gradient">
            NovaMarket
          </span>
        </Link>

        {/* Center Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/services" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Marketplace</Link>
          <Link to="/about" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>About</Link>
          <Link to="/contact" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Contact</Link>
        </div>

        {/* Right side controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="btn-secondary" style={{
            padding: '8px 12px',
            borderRadius: '50%',
            fontSize: '1.2rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {user ? (
            <>
              {/* Messages Shortcut */}
              <Link to="/chat" className="btn-secondary" style={{
                padding: '8px 12px',
                borderRadius: '8px',
                fontWeight: 500,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                💬 Chat
              </Link>

              {/* Notification Bell */}
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button onClick={() => {
                  setShowNotifications(!showNotifications);
                  markNotificationsAsRead();
                }} className="btn-secondary" style={{
                  padding: '8px 12px',
                  borderRadius: '50%',
                  fontSize: '1.1rem',
                  position: 'relative'
                }}>
                  🔔
                  {unreadNotifications > 0 && (
                    <span className="notif-badge">{unreadNotifications}</span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="glass-panel fade-in" style={{
                    position: 'absolute',
                    top: '50px',
                    right: 0,
                    width: '320px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '16px',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <h4 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      Notifications
                    </h4>
                    {notifications.length === 0 ? (
                      <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', textAlign: 'center', padding: '16px 0' }}>
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{
                          fontSize: '0.85rem',
                          padding: '8px',
                          borderRadius: '8px',
                          background: n.is_read ? 'transparent' : 'rgba(var(--accent-primary-rgb), 0.05)',
                          borderLeft: n.is_read ? 'none' : '3px solid var(--accent-primary)'
                        }}>
                          <p style={{ color: 'var(--text-primary)' }}>{n.content}</p>
                          <small style={{ color: 'var(--text-tertiary)' }}>
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </small>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div ref={profileRef} style={{ position: 'relative' }}>
                <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <img src={user.profile_picture || '/uploads/default-avatar.png'} alt={user.full_name} style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--accent-primary)'
                  }} onError={(e) => { e.target.src = 'https://picsum.photos/100/100'; }} />
                </button>

                {showProfileDropdown && (
                  <div className="glass-panel fade-in" style={{
                    position: 'absolute',
                    top: '50px',
                    right: 0,
                    width: '200px',
                    padding: '8px',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.full_name}
                      </p>
                      <small style={{ color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>
                        {user.role}
                      </small>
                    </div>
                    <Link to={`/profile/${user.id}`} onClick={() => setShowProfileDropdown(false)} style={{
                      padding: '8px',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      display: 'block'
                    }} className="chat-item-name">
                      👤 My Profile
                    </Link>
                    <Link to={getDashboardLink()} onClick={() => setShowProfileDropdown(false)} style={{
                      padding: '8px',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      display: 'block'
                    }} className="chat-item-name">
                      📊 Dashboard
                    </Link>
                    <button onClick={handleLogoutClick} style={{
                      padding: '8px',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      width: '100%',
                      cursor: 'pointer',
                      color: 'var(--danger)',
                      fontWeight: 500
                    }}>
                      🚪 Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
