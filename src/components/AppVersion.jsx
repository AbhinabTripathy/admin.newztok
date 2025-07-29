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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  PhoneAndroid as AndroidIcon,
  PhoneIphone as IosIcon,
  SystemUpdate as UpdateIcon,
  CloudUpload as PostIcon,
  Message as ChangeLogIcon,
} from '@mui/icons-material';
import axios from 'axios';

const AppVersion = () => {
  const [versions, setVersions] = useState({
    androidVersion: '',
    iosVersion: '',
    changeLog: '',
    forceUpdate: false,
  });
  const [currentVersions, setCurrentVersions] = useState({
    android: { latestVersion: '', forceUpdate: false, changeLog: '', id: null, createdAt: '', updatedAt: '' },
    ios: { latestVersion: '', forceUpdate: false, changeLog: '', id: null, createdAt: '', updatedAt: '' },
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
    console.log('🔄 Fetching current version values...');
    
    try {
      const token = localStorage.getItem('token');
      console.log('Using token for API requests:', token ? 'Token exists' : 'No token found');
      
      // Fetch Android version using GET method
      try {
        console.log('📱 Fetching Android version from: https://api.newztok.in/api/versions/android');
        
        const androidResponse = await axios.get('https://api.newztok.in/api/versions/android', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        console.log('✅ Android API Response:', androidResponse.data);
        console.log('🔍 Full response structure:', JSON.stringify(androidResponse.data, null, 2));
        
        // Handle deeply nested data structure - the actual data is in .data.version
        const androidResponseData = androidResponse.data?.data?.version || androidResponse.data?.data || androidResponse.data;
        
        console.log('🎯 Extracted Android response data:', androidResponseData);
        
        if (androidResponseData) {
          const androidData = {
            platform: androidResponseData.platform || 'android',
            latestVersion: androidResponseData.latestVersion || '',
            forceUpdate: androidResponseData.forceUpdate || false,
            changeLog: androidResponseData.changeLog || '',
            id: androidResponseData.id || null,
            createdAt: androidResponseData.createdAt || '',
            updatedAt: androidResponseData.updatedAt || ''
          };
          
          console.log('📊 Android version data extracted for UI:', androidData);
          
          setCurrentVersions(prev => {
            const updatedState = {
              ...prev,
              android: {
                latestVersion: androidData.latestVersion,
                forceUpdate: androidData.forceUpdate,
                changeLog: androidData.changeLog,
                id: androidData.id,
                createdAt: androidData.createdAt,
                updatedAt: androidData.updatedAt,
              }
            };
            console.log('🔄 Updating Android state:', updatedState.android);
            return updatedState;
          });
        } else {
          console.log('⚠️ No Android data received from API');
        }
      } catch (error) {
        console.error('❌ Error fetching Android version:', error);
        console.error('Android API Error details:', {
          status: error.response?.status,
          message: error.response?.data?.message,
          data: error.response?.data
        });
      }

      // Fetch iOS version using GET method
      try {
        console.log('📱 Fetching iOS version from: https://api.newztok.in/api/versions/ios');
        
        const iosResponse = await axios.get('https://api.newztok.in/api/versions/ios', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        console.log('✅ iOS API Response:', iosResponse.data);
        console.log('🔍 Full iOS response structure:', JSON.stringify(iosResponse.data, null, 2));
        
        // Handle deeply nested data structure - the actual data is in .data.version
        const iosResponseData = iosResponse.data?.data?.version || iosResponse.data?.data || iosResponse.data;
        
        console.log('🎯 Extracted iOS response data:', iosResponseData);
        
        if (iosResponseData) {
          const iosData = {
            platform: iosResponseData.platform || 'ios',
            latestVersion: iosResponseData.latestVersion || '',
            forceUpdate: iosResponseData.forceUpdate || false,
            changeLog: iosResponseData.changeLog || '',
            id: iosResponseData.id || null,
            createdAt: iosResponseData.createdAt || '',
            updatedAt: iosResponseData.updatedAt || ''
          };
          
          console.log('📊 iOS version data extracted for UI:', iosData);
          
          setCurrentVersions(prev => {
            const updatedState = {
              ...prev,
              ios: {
                latestVersion: iosData.latestVersion,
                forceUpdate: iosData.forceUpdate,
                changeLog: iosData.changeLog,
                id: iosData.id,
                createdAt: iosData.createdAt,
                updatedAt: iosData.updatedAt,
              }
            };
            console.log('🔄 Updating iOS state:', updatedState.ios);
            return updatedState;
          });
        } else {
          console.log('⚠️ No iOS data received from API');
        }
      } catch (error) {
        console.error('❌ Error fetching iOS version:', error);
        console.error('iOS API Error details:', {
          status: error.response?.status,
          message: error.response?.data?.message,
          data: error.response?.data
        });
      }
      
      console.log('✅ Version fetching completed');
      
      // Log final state after a brief delay to ensure state updates are complete
      setTimeout(() => {
        console.log('📊 Final currentVersions state:', {
          android: currentVersions.android,
          ios: currentVersions.ios
        });
      }, 100);
      
    } catch (error) {
      console.error('❌ General error fetching versions:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setVersions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePost = async () => {
    // Validate that at least one platform version is provided
    if (!versions.androidVersion && !versions.iosVersion) {
      setSnackbar({
        open: true,
        message: 'Please provide at least one platform version (Android or iOS)',
        severity: 'error',
      });
      return;
    }

    // Validate changeLog
    if (!versions.changeLog.trim()) {
      setSnackbar({
        open: true,
        message: 'Please provide a change log message',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    let successCount = 0;
    let errorMessages = [];

    try {
      const token = localStorage.getItem('token');

      // Post Android version if provided
      if (versions.androidVersion.trim()) {
        try {
          const androidData = {
            platform: 'android',
            latestVersion: versions.androidVersion,
            changeLog: versions.changeLog,
            forceUpdate: versions.forceUpdate
          };

          console.log('Posting Android data:', androidData);

          const androidResponse = await axios.post(
            'https://api.newztok.in/api/versions/update',
            androidData,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            }
          );

          console.log('Android version update response:', androidResponse.data);
          successCount++;
        } catch (error) {
          console.error('Error updating Android version:', error);
          errorMessages.push(`Android: ${error.response?.data?.message || error.message}`);
        }
      }

      // Post iOS version if provided
      if (versions.iosVersion.trim()) {
        try {
          const iosData = {
            platform: 'ios',
            latestVersion: versions.iosVersion,
            changeLog: versions.changeLog,
            forceUpdate: versions.forceUpdate
          };

          console.log('Posting iOS data:', iosData);

          const iosResponse = await axios.post(
            'https://api.newztok.in/api/versions/update',
            iosData,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            }
          );

          console.log('iOS version update response:', iosResponse.data);
          successCount++;
        } catch (error) {
          console.error('Error updating iOS version:', error);
          errorMessages.push(`iOS: ${error.response?.data?.message || error.message}`);
        }
      }

      // Show appropriate message based on results
      if (successCount > 0 && errorMessages.length === 0) {
        setSnackbar({
          open: true,
          message: `Successfully updated ${successCount} platform version(s)!`,
          severity: 'success',
        });
        
        // Refresh the current versions after successful update
        fetchVersions();
        
        // Clear the form
        setVersions({
          androidVersion: '',
          iosVersion: '',
          changeLog: '',
          forceUpdate: false,
        });
      } else if (successCount > 0 && errorMessages.length > 0) {
        setSnackbar({
          open: true,
          message: `Partially successful: ${successCount} updated, ${errorMessages.length} failed. Errors: ${errorMessages.join(', ')}`,
          severity: 'warning',
        });
        fetchVersions(); // Refresh to show updated versions
      } else {
        setSnackbar({
          open: true,
          message: `Failed to update versions. Errors: ${errorMessages.join(', ')}`,
          severity: 'error',
        });
      }

    } catch (error) {
      console.error('General error updating versions:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update app versions',
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
          <Grid item xs={12} md={6}>
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
                Android Version (Optional)
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
          <Grid item xs={12} md={6}>
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
                iOS Version (Optional)
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

          {/* Change Log */}
          <Grid item xs={12}>
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
                <ChangeLogIcon sx={{ color: '#2196F3' }} />
                Change Log Message
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="e.g., New UI & bug fixes"
                value={versions.changeLog}
                onChange={(e) => handleInputChange('changeLog', e.target.value)}
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <ChangeLogIcon sx={{ color: '#2196F3' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'Poppins',
                    '&:hover fieldset': {
                      borderColor: '#2196F3',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196F3',
                    },
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Force Update Toggle */}
          <Grid item xs={12}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  color: '#333',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <UpdateIcon sx={{ color: '#FF9800' }} />
                Force Update Setting
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={versions.forceUpdate}
                    onChange={(e) => handleInputChange('forceUpdate', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#FF0000',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#FF0000',
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      color: versions.forceUpdate ? '#4CAF50' : '#FF0000',
                      fontSize: '16px',
                    }}
                  >
                    {versions.forceUpdate ? 'Force Update: True' : 'Force Update: False'}
                  </Typography>
                }
                labelPlacement="end"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    ml: 2,
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
              mb: 3,
            }}
          >
            Current Version Values:
          </Typography>
          <Grid container spacing={3}>
            {/* Android Current Version */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, backgroundColor: '#ffffff', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Typography variant="body1" sx={{ fontFamily: 'Poppins', color: '#333', fontWeight: 500, mb: 1 }}>
                  <AndroidIcon sx={{ color: '#4CAF50', mr: 1, verticalAlign: 'middle' }} />
                  Android
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: '#666', mb: 0.5 }}>
                  <strong>Version:</strong> {currentVersions.android.latestVersion || 'Not set'}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: '#666', mb: 0.5 }}>
                  <strong>Force Update:</strong> 
                  <Typography 
                    component="span" 
                    sx={{ 
                      color: currentVersions.android.forceUpdate ? '#4CAF50' : '#FF0000',
                      fontWeight: 500,
                      ml: 0.5
                    }}
                  >
                    {currentVersions.android.forceUpdate ? 'True' : 'False'}
                  </Typography>
                </Typography>
              </Box>
            </Grid>

            {/* iOS Current Version */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, backgroundColor: '#ffffff', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Typography variant="body1" sx={{ fontFamily: 'Poppins', color: '#333', fontWeight: 500, mb: 1 }}>
                  <IosIcon sx={{ color: '#007AFF', mr: 1, verticalAlign: 'middle' }} />
                  iOS
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: '#666', mb: 0.5 }}>
                  <strong>Version:</strong> {currentVersions.ios.latestVersion || 'Not set'}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: '#666', mb: 0.5 }}>
                  <strong>Force Update:</strong> 
                  <Typography 
                    component="span" 
                    sx={{ 
                      color: currentVersions.ios.forceUpdate ? '#4CAF50' : '#FF0000',
                      fontWeight: 500,
                      ml: 0.5
                    }}
                  >
                    {currentVersions.ios.forceUpdate ? 'True' : 'False'}
                  </Typography>
                </Typography>
              </Box>
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