import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateProfile } = useAuth();
  const { addLocalNotification } = useSocket();

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Edit Form State
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [portfolio, setPortfolio] = useState([]);
  const [socialLinks, setSocialLinks] = useState({ linkedin: '', twitter: '', website: '' });
  const [profilePicture, setProfilePicture] = useState('');
  const [coverImage, setCoverImage] = useState('');

  // Portfolio addition item state
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortUrl, setNewPortUrl] = useState('');
  const [newPortDesc, setNewPortDesc] = useState('');

  const isOwnProfile = currentUser && currentUser.id === Number(userId);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const [profileRes, reviewsRes] = await Promise.all([
          axios.get(`/profiles/${userId}`),
          axios.get(`/reviews/freelancer/${userId}`)
        ]);

        const prof = profileRes.data;
        setProfile(prof);
        setReviews(reviewsRes.data);

        // Fill form fields
        setBio(prof.bio || '');
        setSkills(prof.skills || '');
        setExperience(prof.experience || '');
        setContactInfo(prof.contact_info || '');
        setProfilePicture(prof.profile_picture || '/uploads/default-avatar.png');
        setCoverImage(prof.cover_image || '/uploads/default-cover.png');
        
        try {
          setPortfolio(prof.portfolio ? (typeof prof.portfolio === 'string' ? JSON.parse(prof.portfolio) : prof.portfolio) : []);
        } catch {
          setPortfolio([]);
        }
        
        try {
          const socials = prof.social_links ? (typeof prof.social_links === 'string' ? JSON.parse(prof.social_links) : prof.social_links) : {};
          setSocialLinks({
            linkedin: socials.linkedin || '',
            twitter: socials.twitter || '',
            website: socials.website || ''
          });
        } catch {
          setSocialLinks({ linkedin: '', twitter: '', website: '' });
        }

      } catch (err) {
        console.error('Error fetching profile details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('/profiles/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (type === 'avatar') {
        setProfilePicture(res.data.url);
      } else {
        setCoverImage(res.data.url);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleAddPortfolio = (e) => {
    e.preventDefault();
    if (!newPortTitle || !newPortDesc) return;
    const newItem = {
      title: newPortTitle,
      url: newPortUrl,
      description: newPortDesc
    };
    setPortfolio([...portfolio, newItem]);
    setNewPortTitle('');
    setNewPortUrl('');
    setNewPortDesc('');
  };

  const handleRemovePortfolio = (indexToRemove) => {
    setPortfolio(portfolio.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        bio,
        skills,
        experience,
        contact_info: contactInfo,
        portfolio: JSON.stringify(portfolio),
        social_links: JSON.stringify(socialLinks),
        profile_picture: profilePicture,
        cover_image: coverImage
      };

      await updateProfile(updatedData);
      
      // Update local profile state
      setProfile(prev => ({
        ...prev,
        ...updatedData,
      }));

      setIsEditing(false);
      addLocalNotification('Profile saved successfully.');
    } catch (err) {
      console.error('Profile update failed:', err);
      alert('Failed to save profile modifications.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <p style={{ color: 'var(--text-tertiary)' }}>Loading profile details...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>User profile could not be loaded.</h2>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ paddingBottom: '60px' }}>
      {/* 1. COVER IMAGE & AVATAR BANNER */}
      <div className="glass-panel" style={{
        position: 'relative',
        height: '240px',
        borderRadius: 'var(--border-radius-md)',
        overflow: 'hidden',
        marginBottom: '80px'
      }}>
        <img
          src={isEditing ? coverImage : (profile.cover_image || '/uploads/default-cover.png')}
          alt="Cover"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200'; }}
        />
        {isEditing && (
          <label style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: 'var(--accent-primary)',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600
          }}>
            📷 Change Cover
            <input type="file" onChange={(e) => handleImageUpload(e, 'cover')} style={{ display: 'none' }} accept="image/*" />
          </label>
        )}

        {/* Profile Avatar overlay */}
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '40px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '4px solid var(--bg-primary)',
          overflow: 'hidden',
          background: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <img
            src={isEditing ? profilePicture : (profile.profile_picture || '/uploads/default-avatar.png')}
            alt={profile.full_name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.src = 'https://picsum.photos/120/120'; }}
          />
          {isEditing && (
            <label style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              Change
              <input type="file" onChange={(e) => handleImageUpload(e, 'avatar')} style={{ display: 'none' }} accept="image/*" />
            </label>
          )}
        </div>
      </div>

      {/* 2. PROFILE DETAILS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', alignItems: 'start' }}>
        {/* Left column: Contact Info & Skills */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{profile.full_name}</h2>
            <p style={{ color: 'var(--text-secondary)', textTransform: 'capitalize', fontWeight: 600, fontSize: '0.85rem', marginBottom: '16px' }}>
              💼 {profile.role}
            </p>
            
            {profile.role === 'freelancer' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--warning)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '20px' }}>
                ★ {profile.rating ? Number(profile.rating).toFixed(1) : '5.0'}
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>({profile.reviews_count || 0} reviews)</span>
              </div>
            )}

            {isOwnProfile ? (
              <button
                onClick={() => {
                  if (isEditing) handleSave();
                  else setIsEditing(true);
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px' }}
              >
                {isEditing ? '💾 Save Changes' : '📝 Edit Profile'}
              </button>
            ) : (
              currentUser && (
                <button onClick={() => {
                  axios.post('/chats', { recipient_id: profile.id })
                    .then(res => navigate(`/chat?active=${res.data.chatId}`))
                    .catch(err => console.error(err));
                }} className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
                  💬 Message User
                </button>
              )
            )}
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Contact Details</h3>
            {isEditing ? (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  className="form-input"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Email or phone"
                />
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                📞 {profile.contact_info || 'Not provided'}
              </p>
            )}

            {/* Social links */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Social</h4>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={socialLinks.linkedin}
                    onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                    placeholder="LinkedIn link"
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                    placeholder="Twitter link"
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={socialLinks.website}
                    onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
                    placeholder="Website Link"
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                </div>
              ) : (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <div>🔗 LinkedIn: {socialLinks.linkedin || 'N/A'}</div>
                  <div>🔗 Twitter: {socialLinks.twitter || 'N/A'}</div>
                  <div>🔗 Web: {socialLinks.website || 'N/A'}</div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Right column: Bio, Experience, Portfolio, Reviews */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Bio / About */}
          <section className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>About Me</h3>
            {isEditing ? (
              <textarea
                className="form-input"
                rows="4"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your background, experience, or what you specialize in..."
              />
            ) : (
              <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                {profile.bio || 'This user has not set up their bio section.'}
              </p>
            )}
          </section>

          {/* Skills */}
          {profile.role === 'freelancer' && (
            <section className="glass-panel" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Skills & Expertise</h3>
              {isEditing ? (
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="SEO, Google Ads, Copywriting, React (comma separated)"
                  />
                  <small style={{ color: 'var(--text-tertiary)' }}>Separate skills with commas</small>
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profile.skills ? (
                    profile.skills.split(',').map((skill, i) => (
                      <span key={i} className="badge badge-accepted" style={{ textTransform: 'none' }}>
                        {skill.trim()}
                      </span>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No skills listed.</p>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Experience */}
          {profile.role === 'freelancer' && (
            <section className="glass-panel" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Experience & Credentials</h3>
              {isEditing ? (
                <textarea
                  className="form-input"
                  rows="3"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Detail your employment background, previous marketing campaigns managed..."
                />
              ) : (
                <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                  {profile.experience || 'No experience details added.'}
                </p>
              )}
            </section>
          )}

          {/* Portfolio Grid */}
          {profile.role === 'freelancer' && (
            <section className="glass-panel" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '24px' }}>Portfolio Showcase</h3>
              
              {/* Showcases */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: isEditing ? '24px' : '0' }}>
                {portfolio.map((item, idx) => (
                  <div key={idx} className="glass-panel" style={{ padding: '16px', background: 'var(--bg-primary)' }}>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{item.title}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>{item.description}</p>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                        ↗ Visit Project
                      </a>
                    )}
                    {isEditing && (
                      <button onClick={() => handleRemovePortfolio(idx)} style={{
                        display: 'block',
                        background: 'none',
                        border: 'none',
                        color: 'var(--danger)',
                        fontSize: '0.8rem',
                        marginTop: '12px',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}>
                        🗑️ Delete Item
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add portfolio form */}
              {isEditing && (
                <form onSubmit={handleAddPortfolio} className="glass-panel" style={{ padding: '20px', borderStyle: 'dashed' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '16px' }}>Add Portfolio Item</h4>
                  <div className="form-group">
                    <label className="form-label">Project Title</label>
                    <input type="text" className="form-input" value={newPortTitle} onChange={(e) => setNewPortTitle(e.target.value)} placeholder="e.g. 200% ROAS Campaign" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project Link URL (Optional)</label>
                    <input type="url" className="form-input" value={newPortUrl} onChange={(e) => setNewPortUrl(e.target.value)} placeholder="https://example.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Brief Description</label>
                    <textarea className="form-input" rows="2" value={newPortDesc} onChange={(e) => setNewPortDesc(e.target.value)} placeholder="Explain the role you played and outcomes achieved..." required />
                  </div>
                  <button type="submit" className="btn btn-secondary">➕ Add Item</button>
                </form>
              )}
            </section>
          )}

          {/* User Reviews */}
          {profile.role === 'freelancer' && (
            <section className="glass-panel" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '24px' }}>Client Reviews ({reviews.length})</h3>
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No reviews yet for this freelancer.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {reviews.map(review => (
                    <div key={review.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <img
                          src={review.client_picture || '/uploads/default-avatar.png'}
                          alt={review.client_name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://picsum.photos/50/50'; }}
                        />
                        <div>
                          <h4 style={{ fontSize: '0.9rem' }}>{review.client_name}</h4>
                          <span style={{ color: 'var(--warning)', fontSize: '0.75rem' }}>
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </span>
                        </div>
                        <small style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }}>
                          {new Date(review.created_at).toLocaleDateString()}
                        </small>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{review.review_text}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
