import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Configure axios base URL (default to localhost:5001 for backend)
const API_URL = 'http://localhost:5001/api';
axios.defaults.baseURL = API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set Authorization header for all future axios requests
  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthHeader(token);
        try {
          const res = await axios.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error('Failed to restore authentication session:', err);
          localStorage.removeItem('token');
          setAuthHeader(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await axios.post('/auth/login', { email, password });
      const { token, user: userData } = res.data;
      
      localStorage.setItem('token', token);
      setAuthHeader(token);
      
      // Fetch full details including profile
      const userDetailsRes = await axios.get('/auth/me');
      setUser(userDetailsRes.data);
      return userDetailsRes.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const signup = async (formData) => {
    setError(null);
    try {
      const res = await axios.post('/auth/signup', formData);
      const { token, user: userData } = res.data;

      localStorage.setItem('token', token);
      setAuthHeader(token);

      // Fetch full details
      const userDetailsRes = await axios.get('/auth/me');
      setUser(userDetailsRes.data);
      return userDetailsRes.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthHeader(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    setError(null);
    try {
      await axios.put('/profiles', profileData);
      // Refresh current user data
      const res = await axios.get('/auth/me');
      setUser(res.data);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      setError(msg);
      throw new Error(msg);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, updateProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
