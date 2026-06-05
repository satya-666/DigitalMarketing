import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { ServiceList } from './pages/ServiceList';
import { ServiceDetails } from './pages/ServiceDetails';
import { Chat } from './pages/Chat';
import { ClientDashboard } from './pages/ClientDashboard';
import { FreelancerDashboard } from './pages/FreelancerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';

// Route guards
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <p style={{ color: 'var(--text-tertiary)' }}>Verifying authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect role violations back to Home
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flexGrow: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/services" element={<ServiceList />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Secure Private Routes */}
          <Route path="/chat" element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          } />
          
          <Route path="/dashboard/client" element={
            <PrivateRoute allowedRoles={['client', 'admin']}>
              <ClientDashboard />
            </PrivateRoute>
          } />

          <Route path="/dashboard/freelancer" element={
            <PrivateRoute allowedRoles={['freelancer', 'admin']}>
              <FreelancerDashboard />
            </PrivateRoute>
          } />

          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <AppContent />
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
