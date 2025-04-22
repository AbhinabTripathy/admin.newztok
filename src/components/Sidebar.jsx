import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Drawer,
  styled,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Article as ArticleIcon,
  Schedule as ScheduleIcon,
  Block as BlockIcon,
  PostAdd as PostAddIcon,
  VideoCall as VideoCallIcon,
  Group as GroupIcon,
  MonetizationOn as MonetizationOnIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  margin: '4px 0',
  borderRadius: '8px',
  padding: '8px 12px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  backgroundColor: selected ? 'rgba(255, 0, 0, 0.08)' : 'transparent',
  '& .MuiListItemIcon-root': {
    color: selected ? '#FF0000' : '#666666',
  },
  '& .MuiListItemText-primary': {
    color: selected ? '#FF0000' : 'inherit',
    fontWeight: selected ? 500 : 400,
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 0, 0, 0.08)',
    transform: 'translateX(8px)',
    '& .MuiListItemIcon-root': {
      color: '#FF0000',
      transform: 'scale(1.1)',
    },
    '& .MuiListItemText-primary': {
      color: '#FF0000',
      fontFamily: 'Poppins',
      fontWeight: 500,
    },
  },
}));

const menuItems = [
  { text: 'Overview', icon: <DashboardIcon />, section: null, path: '/dashboard' },
  { text: 'POSTS', section: true },
  { text: 'Posts', icon: <ArticleIcon />, path: '/posts' },
  { text: 'Pending Posts', icon: <ScheduleIcon />, path: '/pending-posts' },
  { text: 'Rejected Posts', icon: <BlockIcon />, path: '/rejected-posts' },
  { text: 'Add Standard Post', icon: <PostAddIcon />, path: '/standard-post' },
  { text: 'Add Video Post', icon: <VideoCallIcon />, path: '/add-video-post' },
  { text: 'MANAGEMENT', section: true },
  { text: 'Manage Users', icon: <GroupIcon />, path: '/manage-users' },
  { text: 'Manage Ads', icon: <MonetizationOnIcon />, path: '/manage-ads' },
  { text: 'ANALYTICS & SETTINGS', section: true },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleItemClick = (path) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF',
          overflowX: 'hidden',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '4px 0 8px rgba(0, 0, 0, 0.05)',
          mt: '80px',
          height: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <List sx={{ px: 1.5, pt: 2, flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item, index) => {
          if (item.section) {
            return (
              <Typography
                key={index}
                variant="subtitle2"
                sx={{
                  mt: 2,
                  mb: 0.5,
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                  color: '#666',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  cursor: 'default',
                }}
              >
                {item.text}
              </Typography>
            );
          }
          
          const isSelected = item.path === location.pathname;
          
          return (
            <StyledListItem
              key={index}
              button
              selected={isSelected}
              onClick={() => handleItemClick(item.path)}
              sx={{
                minHeight: 42,
                mb: 0.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 1.5,
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  '& svg': {
                    fontSize: '1.2rem',
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '14px',
                    fontFamily: 'Poppins',
                  },
                }}
              />
            </StyledListItem>
          );
        })}
      </List>
      
      {/* Logout Section */}
      <Box sx={{ p: 1.5, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <StyledListItem
          button
          sx={{
            minHeight: 42,
            '&:hover': {
              backgroundColor: 'rgba(255, 0, 0, 0.08)',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: 1.5,
              justifyContent: 'center',
              color: '#FF0000',
              transition: 'all 0.3s ease',
              '& svg': {
                fontSize: '1.2rem',
              },
            }}
          >
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{
              '& .MuiListItemText-primary': {
                fontSize: '14px',
                fontFamily: 'Poppins',
                fontWeight: 500,
                color: '#FF0000',
              },
            }}
          />
        </StyledListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 