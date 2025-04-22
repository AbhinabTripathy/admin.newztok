import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

const ImageUploadSection = ({ title, dimensions, image, onImageChange, onImageDelete }) => {
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

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        sx={{
          fontSize: '14px',
          color: '#666',
          mb: 1,
          fontFamily: 'Poppins',
        }}
      >
        Please insert {dimensions} px image
      </Typography>
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
              onClick={() => onImageDelete()}
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
  });

  const [webAds, setWebAds] = useState({
    bannerAd: null,
    sideAd: null,
  });

  const handleMobileImageChange = (type, image) => {
    setMobileAds(prev => ({ ...prev, [type]: image }));
  };

  const handleWebImageChange = (type, image) => {
    setWebAds(prev => ({ ...prev, [type]: image }));
  };

  const handlePostMobileAds = () => {
    console.log('Posting mobile ads:', mobileAds);
    // Add your API call here
  };

  const handlePostWebAds = () => {
    console.log('Posting web ads:', webAds);
    // Add your API call here
  };

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
            onImageDelete={() => handleMobileImageChange('cardAd', null)}
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
            onImageDelete={() => handleMobileImageChange('popoverAd', null)}
          />
        </Box>

        <Button
          variant="contained"
          disabled={!mobileAds.cardAd || !mobileAds.popoverAd}
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
          Post Mobile Ads
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
            onImageDelete={() => handleWebImageChange('bannerAd', null)}
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
            onImageDelete={() => handleWebImageChange('sideAd', null)}
          />
        </Box>

        <Button
          variant="contained"
          disabled={!webAds.bannerAd || !webAds.sideAd}
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
          Post Web Ads
        </Button>
      </AdSection>
    </Box>
  );
};

export default ManageAds; 