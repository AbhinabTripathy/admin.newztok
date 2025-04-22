import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  styled,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontSize: '14px',
  padding: '16px',
  '&.MuiTableCell-head': {
    backgroundColor: '#f8f9fa',
    color: '#666',
    fontWeight: 600,
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#f8f9fa',
  },
  '& td': {
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: '8px 16px',
  minHeight: '40px',
  fontFamily: 'Poppins',
  fontSize: '14px',
  '& .MuiListItemIcon-root': {
    minWidth: '32px',
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const FeaturedBadge = styled('span')(({ theme }) => ({
  backgroundColor: 'rgba(76, 175, 80, 0.1)',
  color: '#4CAF50',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 500,
  fontFamily: 'Poppins',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
}));

const posts = [
  {
    headline: 'IIT Kharagpur : भारत का पहला IIT',
    description: 'भारतीय प्रौद्योगिकी संस्थान खड़गपुर (IIT खड़गपुर) &nbsp; भारतीय प्रौद्यो...',
    type: 'Video',
    category: 'National',
    author: 'Prakash Nanda',
    location: 'पटना | Patna, बिहार | Bihar',
    date: 'Mar 25, 2025 · 20:06 PM',
    featured: true,
  },
  {
    headline: 'नेपाली नववर्ष पर वीडियो संदेश जारी कर पूर्व राजा ज्ञानेंद्र क्या...',
    description: 'अशोक दाहाल पटना,बीबीसी न्यूज नेपाली, काठमांड से 16 अप्रैल 202...',
    type: 'Video',
    category: 'National',
    author: 'Sangram Sundaray',
    location: 'खगड़िया | Khagaria, उत्तर प्रदेश | Uttar Pradesh',
    date: 'Apr 16, 2025 · 12:15 PM',
    featured: true,
  },
  {
    headline: 'नेशनल हेराल्ड मनी लॉन्ड्रिंग केस में ईडी ने राहुल-सोनिया के खि...',
    description: 'Newztok Desk : नेशनल हेराल्ड मामले में ईडी ने पूर्व कांग्रेस अध्यक्ष सोनिय...',
    type: 'Standard',
    category: 'Trending',
    author: 'tirvijay singh',
    location: 'पटना | Patna, बिहार | Bihar',
    date: 'Apr 15, 2025 · 18:50 PM',
    featured: true,
  },
  {
    headline: 'आईपीएल में मुंबई ने रोका दिल्ली का विजय रथ',
    description: 'Newztok Desk : &nbsp;मुंबई इंडियंस ने दिल्ली कैपिटल्स को 12 रन से हराकर...',
    type: 'Standard',
    category: 'Sports',
    author: 'tirvijay singh',
    location: 'पटना | Patna, बिहार | Bihar',
    date: 'Apr 14, 2025 · 09:13 AM',
    featured: true,
  },
];

const Posts = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleMenuOpen = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  const handleAction = (action) => {
    console.log(action, selectedPost);
    handleMenuClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CheckCircleIcon sx={{ color: '#4CAF50', mr: 1, fontSize: 28 }} />
        <Typography
          variant="h4"
          sx={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#1a1a1a',
            fontFamily: 'Poppins',
          }}
        >
          Approved Posts
        </Typography>
      </Box>
      
      <Typography
        sx={{
          color: '#666',
          mb: 4,
          fontSize: '15px',
          fontFamily: 'Poppins',
        }}
      >
        Review all approved and featured posts submitted by your team.
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>HEADLINE</StyledTableCell>
              <StyledTableCell>TYPE / CATEGORY</StyledTableCell>
              <StyledTableCell>AUTHOR</StyledTableCell>
              <StyledTableCell align="right">ACTIONS</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#1a1a1a',
                        mb: 0.5,
                        fontFamily: 'Poppins',
                      }}
                    >
                      {post.headline}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '13px',
                        color: '#666',
                        mb: 1,
                        fontFamily: 'Poppins',
                      }}
                    >
                      {post.description}
                    </Typography>
                    {post.featured && (
                      <FeaturedBadge>
                        <CheckCircleIcon sx={{ fontSize: 14 }} />
                        Featured
                      </FeaturedBadge>
                    )}
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#1a1a1a',
                      mb: 0.5,
                      fontFamily: 'Poppins',
                    }}
                  >
                    {post.type}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: '#666',
                      fontFamily: 'Poppins',
                    }}
                  >
                    {post.category}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#1a1a1a',
                      mb: 0.5,
                      fontFamily: 'Poppins',
                    }}
                  >
                    {post.author}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: '#666',
                      mb: 0.5,
                      fontFamily: 'Poppins',
                    }}
                  >
                    {post.location}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: '#666',
                      fontFamily: 'Poppins',
                    }}
                  >
                    {post.date}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, post)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 0.5,
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            minWidth: '160px',
          },
        }}
      >
        <StyledMenuItem onClick={() => handleAction('unfeature')}>
          <ListItemIcon>
            <StarBorderIcon sx={{ fontSize: 20, color: '#666' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Unfeature" 
            primaryTypographyProps={{ 
              style: { 
                fontFamily: 'Poppins',
                fontSize: '14px',
              }
            }}
          />
        </StyledMenuItem>
        <StyledMenuItem onClick={() => handleAction('view')}>
          <ListItemIcon>
            <VisibilityOutlinedIcon sx={{ fontSize: 20, color: '#666' }} />
          </ListItemIcon>
          <ListItemText 
            primary="View" 
            primaryTypographyProps={{ 
              style: { 
                fontFamily: 'Poppins',
                fontSize: '14px',
              }
            }}
          />
        </StyledMenuItem>
        <StyledMenuItem onClick={() => handleAction('edit')}>
          <ListItemIcon>
            <EditOutlinedIcon sx={{ fontSize: 20, color: '#666' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Edit" 
            primaryTypographyProps={{ 
              style: { 
                fontFamily: 'Poppins',
                fontSize: '14px',
              }
            }}
          />
        </StyledMenuItem>
        <StyledMenuItem 
          onClick={() => handleAction('delete')}
          sx={{
            color: '#FF3B30',
            '& .MuiListItemIcon-root': {
              color: '#FF3B30',
            },
          }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText 
            primary="Delete" 
            primaryTypographyProps={{ 
              style: { 
                fontFamily: 'Poppins',
                fontSize: '14px',
              }
            }}
          />
        </StyledMenuItem>
      </Menu>
    </Box>
  );
};

export default Posts; 