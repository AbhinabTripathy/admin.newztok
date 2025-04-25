import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Snackbar,
  Alert,
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
import axios from 'axios';
import { format, parseISO } from 'date-fns';
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
  textTransform: 'capitalize',
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
  '&.national': {
    backgroundColor: '#E3F2FD',
    color: '#2196F3',
  },
  '&.sports': {
    backgroundColor: '#E1F5FE',
    color: '#03A9F4',
  },
  '&.politics': {
    backgroundColor: '#EDE7F6',
    color: '#673AB7',
  },
  '&.technology': {
    backgroundColor: '#F3E5F5',
    color: '#9C27B0',
  },
  '&.business': {
    backgroundColor: '#E0F2F1',
    color: '#009688',
  },
  '&.health': {
    backgroundColor: '#F1F8E9',
    color: '#8BC34A',
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

const PendingPosts = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Helper function to capitalize first letter of a string
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = parseISO(dateString);
      return format(date, 'dd MMM yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString || 'N/A';
    }
  };

  // Format time for display
  const formatTime = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = parseISO(dateString);
      return format(date, 'HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  // Helper function to get the author name from post data
  const getAuthorName = (post) => {
    // First try to get the username directly
    if (post.username) return post.username;
    
    // Then try to get from journalist object
    if (post.journalist && post.journalist.name) return post.journalist.name;
    if (post.journalist && post.journalist.username) return post.journalist.username;
    
    // Then try to get from editor object
    if (post.editor && post.editor.name) return post.editor.name;
    if (post.editor && post.editor.username) return post.editor.username;
    
    // Then try to get from admin object
    if (post.admin && post.admin.name) return post.admin.name;
    if (post.admin && post.admin.username) return post.admin.username;
    
    // Then check if user object exists
    if (post.user && post.user.name) return post.user.name;
    if (post.user && post.user.username) return post.user.username;
    
    // Try to find any property that might contain user info
    for (const key in post) {
      const value = post[key];
      if (value && typeof value === 'object') {
        if (value.name) return value.name;
        if (value.username) return value.username;
      }
    }
    
    // If all else fails
    return 'User ' + (post.user_id || post.userId || post.authorId || '');
  };

  const fetchPendingPosts = async () => {
    try {
      setLoading(true);
      // Get the authentication token stored during login
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found for fetching pending posts');
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      console.log('Fetching pending posts with auth token...');
      // Make authenticated API request with the token
      const response = await axios.get('https://api.newztok.in/api/dashboard/pending-posts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log('Pending posts response received:', response.data);
      
      // Log the full structure to help with debugging
      console.log('Full data structure:', JSON.stringify(response.data, null, 2));
      
      // Extract pending posts from the response
      if (response.data && response.data.data && response.data.data.posts && Array.isArray(response.data.data.posts)) {
        // Posts are in response.data.data.posts
        const formattedPosts = response.data.data.posts.map(post => ({
          id: post.id || '',
          headline: post.title || post.headline || 'Untitled Post',
          description: post.content ? post.content.substring(0, 80) + '...' : post.description || 'No description available',
          category: capitalizeFirstLetter(post.category || post.categoryType || 'General'),
          location: `${capitalizeFirstLetter(post.state) || ''} ${post.district ? ', ' + capitalizeFirstLetter(post.district) : ''}`,
          state: capitalizeFirstLetter(post.state) || '',
          district: capitalizeFirstLetter(post.district) || '',
          submittedAt: formatTime(post.created_at || post.createdAt),
          date: formatDate(post.created_at || post.createdAt),
          author: getAuthorName(post),
          originalData: post
        }));
        
        setPendingPosts(formattedPosts);
        console.log('Formatted pending posts:', formattedPosts);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Posts are directly in response.data.data
        const formattedPosts = response.data.data.map(post => ({
          id: post.id || '',
          headline: post.title || post.headline || 'Untitled Post',
          description: post.content ? post.content.substring(0, 80) + '...' : post.description || 'No description available',
          category: capitalizeFirstLetter(post.category || post.categoryType || 'General'),
          location: `${capitalizeFirstLetter(post.state) || ''} ${post.district ? ', ' + capitalizeFirstLetter(post.district) : ''}`,
          state: capitalizeFirstLetter(post.state) || '',
          district: capitalizeFirstLetter(post.district) || '',
          submittedAt: formatTime(post.created_at || post.createdAt),
          date: formatDate(post.created_at || post.createdAt),
          author: getAuthorName(post),
          originalData: post
        }));
        
        setPendingPosts(formattedPosts);
        console.log('Formatted pending posts from data array:', formattedPosts);
      } else if (response.data && response.data.data && typeof response.data.data === 'object') {
        // Temporary fix to log what's actually in the data
        console.log('Data content:', response.data.data);
        
        // Check if data is empty but valid
        if (Object.keys(response.data.data).length === 0) {
          console.log('Data object is empty, showing empty posts list');
          setPendingPosts([]);
        } else {
          // Try to find posts in any property of data
          let postsFound = false;
          for (const key in response.data.data) {
            const value = response.data.data[key];
            if (Array.isArray(value)) {
              console.log(`Found array in data.${key}, using this as posts`);
              const formattedPosts = value.map(post => ({
                id: post.id || '',
                headline: post.title || post.headline || 'Untitled Post',
                description: post.content ? post.content.substring(0, 80) + '...' : post.description || 'No description available',
                category: capitalizeFirstLetter(post.category || post.categoryType || 'General'),
                location: `${capitalizeFirstLetter(post.state) || ''} ${post.district ? ', ' + capitalizeFirstLetter(post.district) : ''}`,
                state: capitalizeFirstLetter(post.state) || '',
                district: capitalizeFirstLetter(post.district) || '',
                submittedAt: formatTime(post.created_at || post.createdAt),
                date: formatDate(post.created_at || post.createdAt),
                author: getAuthorName(post),
                originalData: post
              }));
              
              setPendingPosts(formattedPosts);
              postsFound = true;
              break;
            }
          }
          
          if (!postsFound) {
            console.warn('Could not find posts array in the response data');
            setError('Unable to locate posts in the API response.');
          }
        }
      } else if (response.data && Array.isArray(response.data)) {
        // Direct array in response
        const formattedPosts = response.data.map(post => ({
          id: post.id || '',
          headline: post.title || post.headline || 'Untitled Post',
          description: post.content ? post.content.substring(0, 80) + '...' : post.description || 'No description available',
          category: capitalizeFirstLetter(post.category || post.categoryType || 'General'),
          location: `${capitalizeFirstLetter(post.state) || ''} ${post.district ? ', ' + capitalizeFirstLetter(post.district) : ''}`,
          state: capitalizeFirstLetter(post.state) || '',
          district: capitalizeFirstLetter(post.district) || '',
          submittedAt: formatTime(post.created_at || post.createdAt),
          date: formatDate(post.created_at || post.createdAt),
          author: getAuthorName(post),
          originalData: post
        }));
        
        setPendingPosts(formattedPosts);
      } else {
        console.warn('Could not find pending posts in the expected API response structure');
        console.log('Response structure:', typeof response.data, response.data ? Object.keys(response.data) : 'null');
        
        // If we have a successful response but no posts, assume empty list
        if (response.data && response.data.success === true) {
          console.log('API returned success but no posts, showing empty list');
          setPendingPosts([]);
        } else {
          setError('Unable to load pending posts. Unexpected data format received.');
        }
      }
    } catch (err) {
      console.error('Error fetching pending posts:', err);
      setError('Failed to load pending posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const handleApprovePost = async (postId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Authentication required. Please login again.',
          severity: 'error'
        });
        return;
      }

      // Log the URL for debugging
      console.log(`Approving post with ID: ${postId}`);
      console.log(`Using API endpoint: https://api.newztok.in/api/news/admin/news/status/${postId}`);

      const response = await axios.put(
        `https://api.newztok.in/api/news/admin/news/status/${postId}`,
        { status: 'approved' }, // Send status in request body
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Approve response:', response.data);
      
      if (response.data && response.data.success) {
        setSnackbar({
          open: true,
          message: 'Post approved successfully',
          severity: 'success'
        });
        
        // Refresh the pending posts list
        await fetchPendingPosts();
      } else {
        setSnackbar({
          open: true,
          message: response.data?.message || 'Failed to approve post',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Error approving post:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'An error occurred while approving the post',
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
      handleMenuClose();
    }
  };

  const handleRejectPost = async (postId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Authentication required. Please login again.',
          severity: 'error'
        });
        return;
      }

      // Log the URL for debugging
      console.log(`Rejecting post with ID: ${postId}`);
      console.log(`Using API endpoint: https://api.newztok.in/api/news/admin/news/status/${postId}`);

      // Use the new API endpoint and include the status in the request body
      const response = await axios.put(
        `https://api.newztok.in/api/news/admin/news/status/${postId}`,
        { status: 'rejected' }, // Send status in request body
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Reject response:', response.data);
      
      if (response.data && response.data.success) {
        setSnackbar({
          open: true,
          message: 'Post rejected successfully',
          severity: 'success'
        });
        
        // Refresh the pending posts list
        await fetchPendingPosts();
      } else {
        setSnackbar({
          open: true,
          message: response.data?.message || 'Failed to reject post',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Error rejecting post:', err);
      setSnackbar({
        open: true,
        message: `Failed to reject post: ${err.response?.data?.message || err.message}`,
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
      handleMenuClose();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

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
    } else if (action === 'approve' && selectedPost) {
      handleApprovePost(selectedPost.id);
    } else if (action === 'reject' && selectedPost) {
      handleRejectPost(selectedPost.id);
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

  const handleApproveReject = (action) => {
    if (action === 'approve' && viewingPost) {
      handleApprovePost(viewingPost.id);
    } else if (action === 'reject' && viewingPost) {
      handleRejectPost(viewingPost.id);
    }
    setViewingPost(null);
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
        onApprove={() => handleApproveReject('approve')}
        onReject={() => handleApproveReject('reject')}
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress sx={{ color: '#6B73FF' }} />
        </Box>
      ) : error ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            textAlign: 'center', 
            color: '#FF3B30',
            border: '1px solid rgba(255, 59, 48, 0.2)',
            borderRadius: 1
          }}
        >
          <Typography sx={{ fontFamily: 'Poppins' }}>{error}</Typography>
        </Paper>
      ) : (
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
              {pendingPosts.length > 0 ? (
                pendingPosts.map((post, index) => (
                  <StyledTableRow key={post.id || index}>
                    <StyledTableCell>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#1a1a1a',
                            fontFamily: 'Poppins',
                          }}
                        >
                          {post.headline}
                        </Typography>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      <CategoryChip 
                        label={post.category} 
                        className={post.category.toLowerCase()}
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
                          {post.location || 'No location data'}
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
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography sx={{ fontFamily: 'Poppins', color: '#666' }}>
                      No pending posts found
                    </Typography>
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
        <StyledMenuItem 
          onClick={() => handleAction('approve')}
          disabled={actionLoading}
        >
          <ListItemIcon>
            {actionLoading ? (
              <CircularProgress size={20} sx={{ color: '#4CAF50' }} />
            ) : (
              <CheckCircleOutlineIcon sx={{ fontSize: 20, color: '#4CAF50' }} />
            )}
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
        <StyledMenuItem 
          onClick={() => handleAction('reject')}
          disabled={actionLoading}
        >
          <ListItemIcon>
            {actionLoading ? (
              <CircularProgress size={20} sx={{ color: '#FF3B30' }} />
            ) : (
              <BlockOutlinedIcon sx={{ fontSize: 20, color: '#FF3B30' }} />
            )}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%', fontFamily: 'Poppins' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PendingPosts; 