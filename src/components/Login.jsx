import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/image/NewzTok logo-2.svg';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Log the data being sent
      console.log('Sending login request with data:', formData);

      const response = await axios.post('https://api.newztok.in/api/auth/login', 
        {
          username: formData.username.trim(),
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      // Detailed logging of the response
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      
      // Check if token exists in response.data.data
      const token = response.data.data?.token;
      console.log('Extracted token:', token);
      
      if (token) {
        // Store the token in localStorage
        localStorage.setItem('token', token);
        // Set default authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
      } else {
        console.error('Token not found in response data:', response.data);
        setError('No token received from server');
      }
    } catch (err) {
      console.error('Login error details:', {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
        message: err.message,
        config: err.config
      });
      
      if (err.response?.status === 404) {
        setError('API endpoint not found. Please check the server configuration.');
      } else if (err.response?.status === 401) {
        setError('Invalid username or password. Please check your credentials.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message.includes('CORS')) {
        setError('Unable to connect to the server. Please try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '400px',
          p: 4,
          borderRadius: 3,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img
          src={logo}
          alt="NewzTok Logo"
          style={{
            width: '120px',
            marginBottom: '24px',
          }}
        />

        <Typography
          variant="h4"
          sx={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#1a1a1a',
            mb: 1,
            fontFamily: 'Poppins',
          }}
        >
          Admin Portal
        </Typography>

        <Typography
          sx={{
            fontSize: '14px',
            color: '#666',
            mb: 4,
            fontFamily: 'Poppins',
          }}
        >
          Sign in with your username
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#1a1a1a',
              mb: 1,
              fontFamily: 'Poppins',
            }}
          >
            Username
          </Typography>
          <TextField
            fullWidth
            name="username"
            placeholder="e.g. john_doe"
            value={formData.username}
            onChange={handleChange}
            required
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#fff',
              },
            }}
          />

          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#1a1a1a',
              mb: 1,
              fontFamily: 'Poppins',
            }}
          >
            Password
          </Typography>
          <TextField
            fullWidth
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#fff',
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
              height: '48px',
              borderRadius: '8px',
              backgroundColor: '#1976D2',
              fontSize: '16px',
              fontWeight: 500,
              textTransform: 'none',
              fontFamily: 'Poppins',
              '&:hover': {
                backgroundColor: '#1565C0',
              },
              '&:disabled': {
                backgroundColor: '#BDBDBD',
              },
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login; 