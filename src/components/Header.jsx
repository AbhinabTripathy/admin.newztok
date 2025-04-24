import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
} from '@mui/material';
import logo from '../assets/image/NewzTok logo-2.svg';

const Header = () => {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: 'white', 
        color: 'black',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        height: '80px',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar 
        sx={{ 
          minHeight: '80px !important',
          px: { xs: 2, sm: 3 },
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
          }}
        >
          <img 
            src={logo} 
            alt="NewzTok" 
            style={{ 
              height: 120,
              transition: 'transform 0.3s ease',
              cursor: 'pointer',
              marginTop: '10px',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              gap: 0.8,
              marginTop: '10px',
            }}
          >
            <Typography
              variant="h6"
              noWrap
              sx={{ 
                color: '#FF0000', 
                fontWeight: 600,
                fontSize: '24px',
                fontFamily: 'Poppins',
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
              }}
            >
              News & Staff
            </Typography>
            <Typography
              variant="h6"
              noWrap
              sx={{ 
                color: '#FF0000', 
                fontWeight: 500,
                fontSize: '22px',
                fontFamily: 'Poppins',
                letterSpacing: '-0.5px',
                opacity: 0.9,
                lineHeight: 1.2,
              }}
            >
              Management
            </Typography>
          </Box>
        </Box>

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            marginTop: '10px',
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              padding: '6px 8px',
              borderRadius: 1,
            }}
          >
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36,
                border: '2px solid rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.2s ease',
                backgroundColor: '#FF3B30',
                color: 'white',
                fontFamily: 'Poppins',
                fontWeight: 500,
              }} 
            >
              A
            </Avatar>
            <Typography 
              className="admin-name"
              variant="subtitle2"
              sx={{
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'color 0.3s ease',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Admin
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 