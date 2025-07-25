import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  Snackbar,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  PhoneAndroid as AndroidIcon,
  PhoneIphone as IosIcon,
  SystemUpdate as UpdateIcon,
  CloudUpload as PostIcon,
} from '@mui/icons-material';
import axios from 'axios';

const AppVersion = () => {
  const [versions, setVersions] = useState({
    androidVersion: '',
    iosVersion: '',
    forcefulUpdateVersion: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load existing versions on component mount
  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://api.newztok.in/api/app-versions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.data && response.data.data) {
        setVersions({
          androidVersion: response.data.data.androidVersion || '',
          iosVersion: response.data.data.iosVersion || '',
          forcefulUpdateVersion: response.data.data.forcefulUpdateVersion || '',
        });
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
      // Don't show error for fetching, as the API might not exist yet
    }
  };

  const handleInputChange = (field, value) => {
    setVersions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePost = async () => {
    if (!versions.androidVersion || !versions.iosVersion || !versions.forcefulUpdateVersion) {
      setSnackbar({
        open: true,
        message: 'Please fill in all version fields',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://api.newztok.in/api/app-versions',
        versions,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Version update response:', response.data);
      setSnackbar({
        open: true,
        message: 'App versions updated successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating versions:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to update app versions',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              color: '#333',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <UpdateIcon sx={{ fontSize: '2rem', color: '#FF0000' }} />
            App Version Management
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              fontFamily: 'Poppins',
            }}
          >
            Manage application versions for different platforms
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Version Input Fields */}
        <Grid container spacing={3}>
          {/* Android Version */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  color: '#333',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <AndroidIcon sx={{ color: '#4CAF50' }} />
                Android Version
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="e.g., 1.0.0"
                value={versions.androidVersion}
                onChange={(e) => handleInputChange('androidVersion', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AndroidIcon sx={{ color: '#4CAF50' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'Poppins',
                    '&:hover fieldset': {
                      borderColor: '#4CAF50',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4CAF50',
                    },
                  },
                }}
              />
            </Box>
          </Grid>

          {/* iOS Version */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  color: '#333',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <IosIcon sx={{ color: '#007AFF' }} />
                iOS Version
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="e.g., 1.0.0"
                value={versions.iosVersion}
                onChange={(e) => handleInputChange('iosVersion', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IosIcon sx={{ color: '#007AFF' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'Poppins',
                    '&:hover fieldset': {
                      borderColor: '#007AFF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#007AFF',
                    },
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Forceful Update Version */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  color: '#333',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <UpdateIcon sx={{ color: '#FF9800' }} />
                Forceful Update Version
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="e.g., 1.0.0"
                value={versions.forcefulUpdateVersion}
                onChange={(e) => handleInputChange('forcefulUpdateVersion', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <UpdateIcon sx={{ color: '#FF9800' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'Poppins',
                    '&:hover fieldset': {
                      borderColor: '#FF9800',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF9800',
                    },
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Post Button */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handlePost}
            disabled={loading}
            startIcon={<PostIcon />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontFamily: 'Poppins',
              fontWeight: 600,
              backgroundColor: '#FF0000',
              borderRadius: 2,
              textTransform: 'none',
              minWidth: 200,
              '&:hover': {
                backgroundColor: '#E60000',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(255, 0, 0, 0.3)',
              },
              '&:disabled': {
                backgroundColor: '#ccc',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? 'Posting...' : 'Post Versions'}
          </Button>
        </Box>

        {/* Current Values Display */}
        <Box sx={{ mt: 4, p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 500,
              color: '#333',
              mb: 2,
            }}
          >
            Current Version Values:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: '#666' }}>
                <strong>Android:</strong> {versions.androidVersion || 'Not set'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: '#666' }}>
                <strong>iOS:</strong> {versions.iosVersion || 'Not set'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: '#666' }}>
                <strong>Forceful Update:</strong> {versions.forcefulUpdateVersion || 'Not set'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AppVersion; 