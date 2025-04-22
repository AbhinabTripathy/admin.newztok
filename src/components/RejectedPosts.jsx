import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import RejectedViewPost from './RejectedViewPost';
import RejectedEditPostScreen from './RejectedEditPostScreen';

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

const StyledTableRow = styled(TableRow)({
  '&:hover': {
    backgroundColor: '#f8f9fa',
  },
  '& td': {
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  },
});

const RejectedChip = styled(Chip)({
  backgroundColor: '#FFE4E4',
  color: '#FF3B30',
  fontFamily: 'Poppins',
  fontSize: '13px',
  fontWeight: 500,
  height: '24px',
  borderRadius: '4px',
});

const StyledMenuItem = styled(MenuItem)({
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
});

const rejectedPosts = [
  {
    headline: 'Test 1',
    subheadline: 'Royal Enfield',
    type: 'Standard',
    category: 'Entertainment',
    author: 'Rajesh Suresh',
    date: 'Apr 03, 2025 · 12:00 PM',
    location: {
      city: 'पटना | Patna',
      state: 'बिहार | Bihar'
    }
  },
  {
    headline: 'Ywsd',
    subheadline: 'Test',
    type: 'Standard',
    category: 'Sports',
    author: 'Rajesh Suresh',
    date: 'Apr 03, 2025 · 12:41 PM',
    location: {
      city: 'पटना | Patna',
      state: 'बिहार | Bihar'
    }
  },
  {
    headline: 'Test',
    subheadline: 'Test',
    type: 'Standard',
    category: 'International',
    author: 'Rajesh Suresh',
    date: 'Apr 03, 2025 · 13:08 PM',
    location: {
      city: 'पटना | Patna',
      state: 'बिहार | Bihar'
    }
  },
  {
    headline: 'asdfghjk',
    subheadline: 'sdfghj',
    type: 'Standard',
    category: 'Sports',
    author: 'Rahul Singh',
    date: 'Apr 03, 2025 · 17:58 PM',
    location: {
      city: 'रांची | Ranchi',
      state: 'झारखंड | Jharkhand'
    }
  },
  {
    headline: 'IPL fixing playing satta',
    subheadline: 'CSK Loose from RCB',
    type: 'Standard',
    category: 'Sports',
    author: 'Rajesh Suresh',
    date: 'Apr 04, 2025 · 16:13 PM',
    location: {
      city: 'पटना | Patna',
      state: 'बिहार | Bihar'
    }
  }
];

const RejectedPosts = () => {
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
  };

  const handleEdit = () => {
    setEditingPost(viewingPost);
    setViewingPost(null);
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
    return <RejectedEditPostScreen post={editingPost} onPublish={handlePublish} />;
  }

  if (viewingPost) {
    return (
      <RejectedViewPost
        post={viewingPost}
        onBack={handleBack}
        onEdit={handleEdit}
        onApproveReject={handleApproveReject}
      />
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <RemoveCircleOutlineIcon sx={{ color: '#FF3B30', fontSize: 28 }} />
        <Typography
          variant="h4"
          sx={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#1a1a1a',
            fontFamily: 'Poppins',
          }}
        >
          Rejected Posts
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: '15px',
          color: '#666',
          mb: 3,
          fontFamily: 'Poppins',
        }}
      >
        These posts were rejected by editors and won't be published unless re-evaluated.
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>HEADLINE</StyledTableCell>
              <StyledTableCell>TYPE / CATEGORY</StyledTableCell>
              <StyledTableCell>AUTHOR</StyledTableCell>
              <StyledTableCell align="right">ACTIONS</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rejectedPosts.map((post, index) => (
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
                      {post.subheadline}
                    </Typography>
                    <RejectedChip
                      label="Rejected"
                      icon={<RemoveCircleOutlineIcon style={{ fontSize: 16 }} />}
                    />
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '14px',
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
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#2196F3',
                        mb: 0.5,
                        fontFamily: 'Poppins',
                        fontWeight: 500,
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
                      {post.date}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '13px',
                        color: '#666',
                        fontFamily: 'Poppins',
                      }}
                    >
                      {post.location.city}, {post.location.state}
                    </Typography>
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
            <VisibilityIcon sx={{ fontSize: 20, color: '#666' }} />
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
            <EditIcon sx={{ fontSize: 20, color: '#666' }} />
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
        <StyledMenuItem onClick={() => handleAction('delete')}>
          <ListItemIcon>
            <DeleteIcon sx={{ fontSize: 20, color: '#FF3B30' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Delete" 
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

export default RejectedPosts; 