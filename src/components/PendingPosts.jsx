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
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  DeleteOutline as DeleteOutlineIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  BlockOutlined as BlockOutlinedIcon,
} from '@mui/icons-material';
import ViewPost from './ViewPost';
import EditPost from './EditPost';

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

const CategoryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#E3F2FD',
  color: '#2196F3',
  fontFamily: 'Poppins',
  fontSize: '13px',
  fontWeight: 500,
  height: '28px',
  borderRadius: '6px',
  textTransform: 'lowercase',
  '&.entertainment': {
    backgroundColor: '#E8F5E9',
    color: '#4CAF50',
  },
  '&.international': {
    backgroundColor: '#FFF3E0',
    color: '#FF9800',
  },
  '&.trending': {
    backgroundColor: '#FCE4EC',
    color: '#E91E63',
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

const pendingPosts = [
  {
    headline: 'Video test by Manoranjan',
    description: 'Testing rasia pila thare ajana by asima panda and mantu ...',
    category: 'entertainment',
    location: 'समस्तीपुर | Samastipur, बिहार | Bihar',
    submittedAt: '02:16',
    date: '16 Apr 2025',
    author: 'Sangram Journalist',
  },
  {
    headline: 'Testing news by Manoranjan',
    description: 'Test3',
    category: 'national',
    location: 'वैशाली | Vaishali, बिहार | Bihar',
    submittedAt: '02:09',
    date: '16 Apr 2025',
    author: 'Sangram Journalist',
  },
  {
    headline: 'Testing from API by rahesh ...',
    description: 'Sample content goes here by rajesh',
    category: 'international',
    location: 'अररिया | Araria, बिहार | Bihar',
    submittedAt: '20:28',
    date: '15 Apr 2025',
    author: 'Sangram Journalist',
  },
  {
    headline: 'Testing from API by sangram',
    description: 'Sample content goes here',
    category: 'national',
    location: 'पटना | Patna, बिहार | Bihar',
    submittedAt: '19:35',
    date: '15 Apr 2025',
    author: 'Sangram Journalist',
  },
  {
    headline: 'झामुमो में हेमंत सोरेन पहली ...',
    description: 'रांची। झारखंड मुक्ति मोर्चा (JMM) के 13वें केंद्रीय महाधिवेशन में ...',
    category: 'trending',
    location: 'रांची | Ranchi, झारखंड | Jharkhand',
    submittedAt: '18:41',
    date: '15 Apr 2025',
    author: 'Tirvijay Singh',
  },
  {
    headline: 'बिहार में कांग्रेस-राजद साथ लड़ेंगे ...',
    description: 'Newztok Desk : बिहार विधानसभा चुनाव को लेकर मंगलवार को ...',
    category: 'national',
    location: 'पटना | Patna, बिहार | Bihar',
    submittedAt: '18:28',
    date: '15 Apr 2025',
    author: 'Tirvijay Singh',
  },
  {
    headline: 'बिहार में सिपाही जमीन वापस ...',
    description: 'Newztok Desk : लोकसभा चुनाव 2024 में सीट बंटवारे को...',
    category: 'trending',
    location: 'पटना | Patna, बिहार | Bihar',
    submittedAt: '17:44',
    date: '15 Apr 2025',
    author: 'Tirvijay Singh',
  },
];

const PendingPosts = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  const handleMenuOpen = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  const handleAction = (action) => {
    if (action === 'view') {
      setViewingPost(selectedPost);
    } else if (action === 'edit') {
      setEditingPost(selectedPost);
    }
    handleMenuClose();
  };

  const handleBack = () => {
    setViewingPost(null);
    setEditingPost(null);
  };

  const handlePublish = () => {
    // Handle publish action
    console.log('Publishing post:', editingPost);
    setEditingPost(null);
  };

  const handleApproveReject = () => {
    // Handle approve/reject action
    console.log('Approve/Reject post:', viewingPost);
  };

  if (editingPost) {
    return <EditPost post={editingPost} onPublish={handlePublish} />;
  }

  if (viewingPost) {
    return (
      <ViewPost
        post={viewingPost}
        onBack={handleBack}
        onEdit={() => setEditingPost(viewingPost)}
        onApproveReject={handleApproveReject}
      />
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          fontSize: '24px',
          fontWeight: 600,
          color: '#1a1a1a',
          mb: 3,
          fontFamily: 'Poppins',
        }}
      >
        Pending Posts
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>HEADLINE</StyledTableCell>
              <StyledTableCell>CATEGORIES</StyledTableCell>
              <StyledTableCell>LOCATION</StyledTableCell>
              <StyledTableCell>SUBMITTED AT</StyledTableCell>
              <StyledTableCell align="right">ACTIONS</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingPosts.map((post, index) => (
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
                        fontFamily: 'Poppins',
                      }}
                    >
                      {post.description}
                    </Typography>
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <CategoryChip 
                    label={post.category} 
                    className={post.category}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon sx={{ fontSize: 16, color: '#666' }} />
                    <Typography
                      sx={{
                        fontSize: '13px',
                        color: '#666',
                        fontFamily: 'Poppins',
                      }}
                    >
                      {post.location}
                    </Typography>
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <TimeIcon sx={{ fontSize: 16, color: '#666' }} />
                      <Typography
                        sx={{
                          fontSize: '13px',
                          color: '#666',
                          fontFamily: 'Poppins',
                        }}
                      >
                        {post.submittedAt} · {post.date}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 16, color: '#666' }} />
                      <Typography
                        sx={{
                          fontSize: '13px',
                          color: '#2196F3',
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                        }}
                      >
                        {post.author}
                      </Typography>
                    </Box>
                  </Box>
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
            borderRadius: '4px',
            minWidth: '180px',
          },
        }}
      >
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
                color: '#1a1a1a',
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
                color: '#1a1a1a',
              }
            }}
          />
        </StyledMenuItem>
        <StyledMenuItem onClick={() => handleAction('approve')}>
          <ListItemIcon>
            <CheckCircleOutlineIcon sx={{ fontSize: 20, color: '#4CAF50' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Approve" 
            primaryTypographyProps={{ 
              style: { 
                fontFamily: 'Poppins',
                fontSize: '14px',
                color: '#4CAF50',
              }
            }}
          />
        </StyledMenuItem>
        <StyledMenuItem onClick={() => handleAction('reject')}>
          <ListItemIcon>
            <BlockOutlinedIcon sx={{ fontSize: 20, color: '#FF3B30' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Reject" 
            primaryTypographyProps={{ 
              style: { 
                fontFamily: 'Poppins',
                fontSize: '14px',
                color: '#FF3B30',
              }
            }}
          />
        </StyledMenuItem>
      </Menu>
    </Box>
  );
};

export default PendingPosts; 