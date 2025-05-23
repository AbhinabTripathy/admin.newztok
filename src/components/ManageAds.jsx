import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const ImageUploadSection = ({ title, dimensions, image, onImageChange, onImageDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onImageDelete();
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography
          sx={{
            fontSize: '14px',
            color: '#666',
            fontFamily: 'Poppins',
          }}
        >
          Please insert {dimensions} px image
        </Typography>
        
        {image && (
        <Tooltip title="Remove">
          <IconButton 
            onClick={handleDeleteClick}
            sx={{ 
              color: '#FF3B30',
              '&:hover': {
                backgroundColor: 'rgba(255, 59, 48, 0.08)',
              },
            }}
          >
            <DeleteIcon fontSize="small" />
            <Typography sx={{ ml: 0.5, fontSize: '12px', fontFamily: 'Poppins' }}>
              Remove
            </Typography>
          </IconButton>
        </Tooltip>
        )}
      </Box>
      
      <Paper
        sx={{
          width: '100%',
          height: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px dashed #ccc',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {image ? (
          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
              src={image}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
            <IconButton
              onClick={handleDeleteClick}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ) : (
          <Box
            component="label"
            sx={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <AddPhotoAlternateIcon
              sx={{ fontSize: 48, color: '#999', mb: 1 }}
            />
            <Typography
              sx={{
                color: '#666',
                fontFamily: 'Poppins',
              }}
            >
              Click to upload {title}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirm}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title" sx={{ fontFamily: 'Poppins' }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'Poppins' }}>
            Are you sure you want to delete this ad? This action cannot be undone and the ad will be permanently removed from the database.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCancelDelete}
            sx={{ 
              fontFamily: 'Poppins',
              color: '#666'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{ 
              fontFamily: 'Poppins',
              backgroundColor: '#FF3B30',
              '&:hover': {
                backgroundColor: '#D32F2F',
              }
            }}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const AdSection = ({ title, children }) => (
  <Paper
    sx={{
      p: 3,
      mb: 4,
      borderRadius: 3,
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontSize: '20px',
        fontWeight: 600,
        color: '#1a1a1a',
        mb: 3,
        fontFamily: 'Poppins',
      }}
    >
      {title}
    </Typography>
    {children}
  </Paper>
);

const ManageAds = () => {
  const [mobileAds, setMobileAds] = useState({
    cardAd: null,
    popoverAd: null,
    cardRedirectUrl: '',
    popoverRedirectUrl: '',
    cardAdId: null,
    popoverAdId: null,
  });

  const [webAds, setWebAds] = useState({
    bannerAd: null,
    sideAd: null,
    bannerRedirectUrl: '',
    sideRedirectUrl: '',
    bannerAdId: null,
    sideAdId: null,
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  const [loading, setLoading] = useState({
    mobile: false,
    web: false
  });

  // Load existing ads on component mount
  useEffect(() => {
    fetchExistingAds();
  }, []);

  const fetchExistingAds = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('https://api.newztok.in/api/ads', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && Array.isArray(response.data.data)) {
        const ads = response.data.data;
        
        console.log('Fetched ads:', ads);
        
        // Process mobile ads
        const cardAd = ads.find(ad => ad.platform === 'mobile' && ad.type === 'card');
        const popoverAd = ads.find(ad => ad.platform === 'mobile' && ad.type === 'popover');
        
        // Process web ads
        const bannerAd = ads.find(ad => ad.platform === 'web' && ad.type === 'banner');
        const sideAd = ads.find(ad => ad.platform === 'web' && ad.type === 'side');

        // Helper function to get proper image URL
        const getFullImageUrl = (imageUrl) => {
          if (!imageUrl) return null;
          if (imageUrl.startsWith('http')) return imageUrl;
          return `https://api.newztok.in${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
        };

        // Update mobile ads state
        setMobileAds(prev => ({
          ...prev,
          cardAd: cardAd ? getFullImageUrl(cardAd.imageUrl) : null,
          popoverAd: popoverAd ? getFullImageUrl(popoverAd.imageUrl) : null,
          cardRedirectUrl: cardAd ? cardAd.redirectUrl || '' : '',
          popoverRedirectUrl: popoverAd ? popoverAd.redirectUrl || '' : '',
          cardAdId: cardAd ? cardAd.id : null,
          popoverAdId: popoverAd ? popoverAd.id : null,
        }));

        // Update web ads state
        setWebAds(prev => ({
          ...prev,
          bannerAd: bannerAd ? getFullImageUrl(bannerAd.imageUrl) : null,
          sideAd: sideAd ? getFullImageUrl(sideAd.imageUrl) : null,
          bannerRedirectUrl: bannerAd ? bannerAd.redirectUrl || '' : '',
          sideRedirectUrl: sideAd ? sideAd.redirectUrl || '' : '',
          bannerAdId: bannerAd ? bannerAd.id : null,
          sideAdId: sideAd ? sideAd.id : null,
        }));
      }
    } catch (error) {
      console.error('Error fetching existing ads:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load existing ads',
        severity: 'error'
      });
    }
  };

  const handleMobileImageChange = (type, image) => {
    setMobileAds(prev => ({ ...prev, [type]: image }));
  };

  const handleWebImageChange = (type, image) => {
    setWebAds(prev => ({ ...prev, [type]: image }));
  };
  
  const handleMobileRedirectChange = (type, url) => {
    setMobileAds(prev => ({ ...prev, [type]: url }));
  };

  const handleWebRedirectChange = (type, url) => {
    setWebAds(prev => ({ ...prev, [type]: url }));
  };
  
  const handleMobileImageDelete = async (type) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Delete operation failed: No authentication token found');
        setSnackbar({
          open: true,
          message: 'Authentication required. Please login again.',
          severity: 'error'
        });
        return;
      }

      // Get the ad ID based on the type
      let adId;
      if (type === 'cardAd') {
        adId = mobileAds.cardAdId;
      } else if (type === 'popoverAd') {
        adId = mobileAds.popoverAdId;
      }

      if (adId) {
        console.log(`Attempting to delete ${type} with ID: ${adId}`);
        const response = await axios.delete(`https://api.newztok.in/api/ads/${adId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log(`Successfully deleted ${type} permanently:`, response.data);
        
        // Clear all related state
        setMobileAds(prev => ({
          ...prev,
          [type]: null,
          [`${type}Id`]: null,
          [`${type}RedirectUrl`]: ''
        }));

        // Refresh the ads list to ensure we have the latest state
        await fetchExistingAds();
        
        setSnackbar({
          open: true,
          message: 'Ad has been permanently deleted from database',
          severity: 'success'
        });
      } else {
        console.log(`No ad ID found for ${type}, removing from state only`);
        setMobileAds(prev => ({ ...prev, [type]: null }));
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      if (error.response) {
        console.log('Server response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        console.log('No response received:', error.request);
      } else {
        console.log('Error details:', error.message);
      }
      setSnackbar({
        open: true,
        message: 'Failed to delete ad from database',
        severity: 'error'
      });
    }
  };
  
  const handleWebImageDelete = async (type) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Delete operation failed: No authentication token found');
        setSnackbar({
          open: true,
          message: 'Authentication required. Please login again.',
          severity: 'error'
        });
        return;
      }

      // Get the ad ID based on the type
      let adId;
      if (type === 'bannerAd') {
        adId = webAds.bannerAdId;
      } else if (type === 'sideAd') {
        adId = webAds.sideAdId;
      }

      if (adId) {
        console.log(`Attempting to delete ${type} with ID: ${adId}`);
        const response = await axios.delete(`https://api.newztok.in/api/ads/${adId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log(`Successfully deleted ${type} permanently:`, response.data);
        
        // Clear all related state
        setWebAds(prev => ({
          ...prev,
          [type]: null,
          [`${type}Id`]: null,
          [`${type}RedirectUrl`]: ''
        }));

        // Refresh the ads list to ensure we have the latest state
        await fetchExistingAds();
        
        setSnackbar({
          open: true,
          message: 'Ad has been permanently deleted from database',
          severity: 'success'
        });
      } else {
        console.log(`No ad ID found for ${type}, removing from state only`);
        setWebAds(prev => ({ ...prev, [type]: null }));
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      if (error.response) {
        console.log('Server response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        console.log('No response received:', error.request);
      } else {
        console.log('Error details:', error.message);
      }
      setSnackbar({
        open: true,
        message: 'Failed to delete ad from database',
        severity: 'error'
      });
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handlePostMobileAds = async () => {
    try {
      setLoading(prev => ({ ...prev, mobile: true }));
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Authentication required. Please login again.',
          severity: 'error'
        });
        return;
      }
      
      // Post card ad
      if (mobileAds.cardAd) {
        try {
          const cardFormData = new FormData();
        const cardFile = await dataURLtoFile(mobileAds.cardAd, 'card_ad.jpg');
        cardFormData.append('image', cardFile);
        cardFormData.append('platform', 'mobile');
        cardFormData.append('type', 'card');
          cardFormData.append('redirectUrl', mobileAds.cardRedirectUrl);
          
          console.log('Attempting to upload card ad with field name "image"');
          
          const response = await axios.post('https://api.newztok.in/api/ads', cardFormData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              // Let axios set the content type automatically
              // 'Content-Type': 'multipart/form-data'
            }
          });
          
          console.log('Card ad posted successfully:', response.data);
          
          setSnackbar({
            open: true,
            message: 'Card ad posted successfully',
            severity: 'success'
          });
        } catch (error) {
          console.error('Error posting card ad:', error);
          if (error.response) {
            console.log('Server responded with:', error.response.status, error.response.data);
          }
          
          setSnackbar({
            open: true,
            message: 'Failed to post card ad. Check console for details.',
            severity: 'error'
          });
        }
      }
      
      // Post popover ad
      if (mobileAds.popoverAd) {
        try {
          const popoverFormData = new FormData();
          const popoverFile = await dataURLtoFile(mobileAds.popoverAd, 'popover_ad.jpg');
          popoverFormData.append('image', popoverFile);
          popoverFormData.append('platform', 'mobile');
          popoverFormData.append('type', 'popover');
          popoverFormData.append('redirectUrl', mobileAds.popoverRedirectUrl);
          
          console.log('Attempting to upload popover ad with field name "image"');
          
          const response = await axios.post('https://api.newztok.in/api/ads', popoverFormData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              // Let axios set the content type automatically
              // 'Content-Type': 'multipart/form-data'
            }
          });
      
          console.log('Popover ad posted successfully:', response.data);
      
      setSnackbar({
        open: true,
            message: 'Popover ad posted successfully',
        severity: 'success'
      });
        } catch (error) {
          console.error('Error posting popover ad:', error);
          if (error.response) {
            console.log('Server responded with:', error.response.status, error.response.data);
          }
          
          setSnackbar({
            open: true,
            message: 'Failed to post popover ad. Check console for details.',
            severity: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Error in mobile ads posting:', error);
      
      setSnackbar({
        open: true,
        message: 'An unexpected error occurred. Please check console for details.',
        severity: 'error'
      });
    } finally {
      setLoading(prev => ({ ...prev, mobile: false }));
    }
  };

  const handlePostWebAds = async () => {
    try {
      setLoading(prev => ({ ...prev, web: true }));
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Authentication required. Please login again.',
          severity: 'error'
        });
        return;
      }
      
      // Handle banner ad
      if (webAds.bannerAd) {
        try {
          // Create a new FormData
          const formData = new FormData();
          
          // Convert base64 to File
        const bannerFile = await dataURLtoFile(webAds.bannerAd, 'banner_ad.jpg');
          
          // Try the field name "image" (singular)
          formData.append('image', bannerFile);
          formData.append('platform', 'web');
          formData.append('type', 'banner');
          formData.append('redirectUrl', webAds.bannerRedirectUrl);
          
          console.log('Attempting to upload banner ad with field name "image"');
          
          const response = await axios.post('https://api.newztok.in/api/ads', formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              // Let axios set the content type automatically with boundary
              // 'Content-Type': 'multipart/form-data'
            }
          });
          
          console.log('Banner ad posted successfully:', response.data);
          
          setSnackbar({
            open: true,
            message: 'Banner ad posted successfully',
            severity: 'success'
          });
        } catch (error) {
          console.error('Error posting banner ad:', error);
          if (error.response) {
            console.log('Server responded with:', error.response.status, error.response.data);
          }
          
          setSnackbar({
            open: true,
            message: 'Failed to post banner ad. Check console for details.',
            severity: 'error'
          });
        }
      }
      
      // Handle side ad
      if (webAds.sideAd) {
        try {
          // Create a new FormData
          const formData = new FormData();
          
          // Convert base64 to File
          const sideFile = await dataURLtoFile(webAds.sideAd, 'side_ad.jpg');
          
          // Try the field name "image" (singular)
          formData.append('image', sideFile);
          formData.append('platform', 'web');
          formData.append('type', 'side');
          formData.append('redirectUrl', webAds.sideRedirectUrl);
          
          console.log('Attempting to upload side ad with field name "image"');
          
          const response = await axios.post('https://api.newztok.in/api/ads', formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              // Let axios set the content type automatically with boundary
              // 'Content-Type': 'multipart/form-data'
            }
          });
      
          console.log('Side ad posted successfully:', response.data);
      
      setSnackbar({
        open: true,
            message: 'Side ad posted successfully',
        severity: 'success'
      });
        } catch (error) {
          console.error('Error posting side ad:', error);
          if (error.response) {
            console.log('Server responded with:', error.response.status, error.response.data);
          }
          
          setSnackbar({
            open: true,
            message: 'Failed to post side ad. Check console for details.',
            severity: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Error in web ads posting:', error);
      
      setSnackbar({
        open: true,
        message: 'An unexpected error occurred. Please check console for details.',
        severity: 'error'
      });
    } finally {
      setLoading(prev => ({ ...prev, web: false }));
    }
  };
  
  // Helper function to convert Data URL to File object
  const dataURLtoFile = (dataUrl, filename) => {
    return new Promise((resolve) => {
      const arr = dataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      
      const file = new File([u8arr], filename, { type: mime });
      resolve(file);
    });
  };

  // Add cleanup function to clear deleted ads from localStorage when component unmounts
  useEffect(() => {
    return () => {
      localStorage.removeItem('deletedAds');
    };
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          fontSize: '28px',
          fontWeight: 600,
          color: '#1a1a1a',
          mb: 4,
          fontFamily: 'Poppins',
        }}
      >
        Manage Ads
      </Typography>

      <AdSection title="Mobile App Ads">
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#1a1a1a',
              mb: 2,
              fontFamily: 'Poppins',
            }}
          >
            Card Ads
          </Typography>
          <ImageUploadSection
            title="Card Ad"
            dimensions="320 × 610"
            image={mobileAds.cardAd}
            onImageChange={(img) => handleMobileImageChange('cardAd', img)}
            onImageDelete={() => handleMobileImageDelete('cardAd')}
          />
          <TextField
            fullWidth
            label="Redirect URL"
            placeholder="https://example.com"
            value={mobileAds.cardRedirectUrl}
            onChange={(e) => handleMobileRedirectChange('cardRedirectUrl', e.target.value)}
            margin="normal"
            sx={{ mb: 2 }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#1a1a1a',
              mb: 2,
              fontFamily: 'Poppins',
            }}
          >
            Popover Ads
          </Typography>
          <ImageUploadSection
            title="Popover Ad"
            dimensions="360 × 640"
            image={mobileAds.popoverAd}
            onImageChange={(img) => handleMobileImageChange('popoverAd', img)}
            onImageDelete={() => handleMobileImageDelete('popoverAd')}
          />
          <TextField
            fullWidth
            label="Redirect URL"
            placeholder="https://example.com"
            value={mobileAds.popoverRedirectUrl}
            onChange={(e) => handleMobileRedirectChange('popoverRedirectUrl', e.target.value)}
            margin="normal"
            sx={{ mb: 2 }}
          />
        </Box>

        <Button
          variant="contained"
          disabled={(!mobileAds.cardAd || !mobileAds.popoverAd) || loading.mobile}
          onClick={handlePostMobileAds}
          sx={{
            mt: 2,
            backgroundColor: '#2196F3',
            fontFamily: 'Poppins',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#1976D2',
            },
          }}
        >
          {loading.mobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
              Posting...
            </Box>
          ) : (
            'Post Mobile Ads'
          )}
        </Button>
      </AdSection>

      <AdSection title="Web App Ads">
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#1a1a1a',
              mb: 2,
              fontFamily: 'Poppins',
            }}
          >
            Banner Ads
          </Typography>
          <ImageUploadSection
            title="Banner Ad"
            dimensions="970 × 100"
            image={webAds.bannerAd}
            onImageChange={(img) => handleWebImageChange('bannerAd', img)}
            onImageDelete={() => handleWebImageDelete('bannerAd')}
          />
          <TextField
            fullWidth
            label="Redirect URL"
            placeholder="https://example.com"
            value={webAds.bannerRedirectUrl}
            onChange={(e) => handleWebRedirectChange('bannerRedirectUrl', e.target.value)}
            margin="normal"
            sx={{ mb: 2 }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#1a1a1a',
              mb: 2,
              fontFamily: 'Poppins',
            }}
          >
            Side Ads
          </Typography>
          <ImageUploadSection
            title="Side Ad"
            dimensions="380 × 350"
            image={webAds.sideAd}
            onImageChange={(img) => handleWebImageChange('sideAd', img)}
            onImageDelete={() => handleWebImageDelete('sideAd')}
          />
          <TextField
            fullWidth
            label="Redirect URL"
            placeholder="https://example.com"
            value={webAds.sideRedirectUrl}
            onChange={(e) => handleWebRedirectChange('sideRedirectUrl', e.target.value)}
            margin="normal"
            sx={{ mb: 2 }}
          />
        </Box>

        <Button
          variant="contained"
          disabled={(!webAds.bannerAd || !webAds.sideAd) || loading.web}
          onClick={handlePostWebAds}
          sx={{
            mt: 2,
            backgroundColor: '#2196F3',
            fontFamily: 'Poppins',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#1976D2',
            },
          }}
        >
          {loading.web ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
              Posting...
            </Box>
          ) : (
            'Post Web Ads'
          )}
        </Button>
      </AdSection>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity || 'info'} 
          sx={{ width: '100%', fontFamily: 'Poppins' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageAds; 