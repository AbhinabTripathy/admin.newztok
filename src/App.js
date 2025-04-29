import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Posts from './components/Posts';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import PendingPosts from './components/PendingPosts';
import RejectedPosts from './components/RejectedPosts';
import StandardPost from './components/StandardPost';
import VideoPost from './components/VideoPost';
import ManageUsers from './components/ManageUsers';
import EditUser from './components/EditUser';
import CreateNewUser from './components/CreateNewUser';
import ManageAds from './components/ManageAds';
import AdminEditPost from './components/AdminEditPost';
import Login from './components/Login';
import axios from 'axios';

// Authentication check wrapper
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Set token for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Verify token validity (optional - remove if not needed)
        // This is a placeholder - you might want to implement a proper token verification endpoint
        // await axios.get('https://api.newztok.in/api/auth/verify-token');
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#FF3B30' }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const ProtectedLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            mt: '80px',
            minHeight: 'calc(100vh - 80px)',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/pending-posts" element={<PendingPosts />} />
              <Route path="/rejected-posts" element={<RejectedPosts />} />
              <Route path="/standard-post" element={<StandardPost />} />
              <Route path="/add-video-post" element={<VideoPost />} />
              <Route path="/manage-users" element={<ManageUsers />} />
              <Route path="/manage-users/edit/:id" element={<EditUser />} />
              <Route path="/create-user" element={<CreateNewUser />} />
              <Route path="/manage-ads" element={<ManageAds />} />
              <Route path="/edit-post/:postId" element={<AdminEditPost />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

// Auth verification for login route
const LoginRoute = () => {
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      }
      setChecking(false);
    };

    checkAuth();
  }, []);

  if (checking) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#FF3B30' }} />
      </Box>
    );
  }

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
