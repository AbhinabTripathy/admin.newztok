import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        padding: '12px 24px',
        backgroundColor: '#fff',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography
        sx={{
          color: 'rgba(0, 0, 0, 0.45)',
          fontSize: '13px',
          fontFamily: 'Poppins-Regular',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        © NewzTok
        <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>•</span>
        All rights reserved
      </Typography>
    </Box>
  );
};

export default Footer; 