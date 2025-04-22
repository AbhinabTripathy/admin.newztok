import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/image/NewzTok logo-2.svg';

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // If no token exists, just redirect to login
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      // Call the logout endpoint
      await axios.post('https://api.newztok.in/api/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Remove token from localStorage
      localStorage.removeItem('token');
      
      // Remove Authorization header for future requests
      delete axios.defaults.headers.common['Authorization'];
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to login and clear token
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

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
          <IconButton 
            size="medium" 
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: 'rgba(255, 0, 0, 0.08)',
              },
            }}
          >
            <Badge 
              badgeContent={3} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '10px',
                  height: '16px',
                  minWidth: '16px',
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                },
              }}
            >
              <NotificationsIcon sx={{ fontSize: '24px', color: '#666' }} />
            </Badge>
          </IconButton>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: '6px 8px',
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
            onClick={handleClick}
          >
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36,
                border: '2px solid rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }} 
            />
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

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
              minWidth: 180,
              '& .MuiMenuItem-root': {
                fontFamily: 'Poppins',
                fontSize: '14px',
                py: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem sx={{ 
            gap: 1.5,
            '&:hover': { color: '#6B73FF' },
          }}>
            <ListItemIcon>
              <PersonIcon fontSize="small" sx={{ color: 'inherit' }} />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem 
            onClick={handleLogout}
            sx={{ 
              gap: 1.5,
              color: '#FF0000',
              '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.08)' },
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: 'inherit' }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 