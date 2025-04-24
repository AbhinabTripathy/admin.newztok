import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  RemoveCircleOutline as RemoveCircleOutlineIcon,
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

const RejectedPosts = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [rejectedPosts, setRejectedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1
  });

  useEffect(() => {
    const fetchRejectedNews = async () => {
      try {
        setLoading(true);
        console.log('Fetching rejected news data...');
        
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await axios.get('https://api.newztok.in/api/dashboard/rejected-news', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Rejected news fetched successfully:', response.data);
        
        // Check if the response has the expected structure
        if (response.data.success && response.data.data && response.data.data.news) {
          const newsData = response.data.data.news;
          setRejectedPosts(newsData);
          setPagination({
            total: response.data.data.total || 0,
            totalPages: response.data.data.totalPages || 0,
            currentPage: response.data.data.currentPage || 1
          });
          
          // Log the location structure from the first post if available
          if (newsData.length > 0) {
            console.log('Sample post data structure:', {
              headline: newsData[0].headline,
              location: newsData[0].location,
              city: newsData[0].city,
              state: newsData[0].state,
              author: newsData[0].author
            });
            
            // Log more detailed information about location data across all posts
            console.log('Location data analysis:', {
              totalPosts: newsData.length,
              postsWithLocationObject: newsData.filter(post => post.location && typeof post.location === 'object').length,
              postsWithLocationString: newsData.filter(post => post.location && typeof post.location === 'string').length,
              postsWithNoLocation: newsData.filter(post => !post.location).length,
              postsWithCityStateProps: newsData.filter(post => post.city || post.state).length,
              firstFewPostsLocationData: newsData.slice(0, 3).map(post => ({
                postId: post._id,
                location: post.location,
                city: post.city,
                state: post.state
              }))
            });
          }
          
          console.log('Processed news data:', newsData);
        } else {
          console.error('Unexpected API response structure:', response.data);
          setError('Unexpected API response structure');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rejected news:', err);
        console.log('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.message || 'Failed to fetch rejected news');
        setLoading(false);
      }
    };

    fetchRejectedNews();
  }, []);

  const handleMenuOpen = (event, post) => {
    setAnchorEl(event?.currentTarget);
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ my: 2 }}>
          {error}
        </Typography>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>HEADLINE</StyledTableCell>
                <StyledTableCell>TYPE / CATEGORY</StyledTableCell>
                <StyledTableCell>AUTHOR</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rejectedPosts.length > 0 ? (
                rejectedPosts.map((post, index) => (
                  <StyledTableRow key={post._id || index}>
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
                          {post.headline || 'No headline'}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '13px',
                            color: '#666',
                            mb: 1,
                            fontFamily: 'Poppins',
                          }}
                        >
                          {post.subheadline || 'No subheadline'}
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
                          {post.type ? post.type.charAt(0).toUpperCase() + post.type.slice(1) : 'N/A'}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '13px',
                            color: '#666',
                            fontFamily: 'Poppins',
                          }}
                        >
                          {post.category ? post.category.charAt(0).toUpperCase() + post.category.slice(1) : 'N/A'}
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
                          {post.author?.name || post.author || 'Unknown'}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '13px',
                            color: '#666',
                            mb: 0.5,
                            fontFamily: 'Poppins',
                          }}
                        >
                          {post.rejectedAt ? new Date(post.rejectedAt).toLocaleString('en-US', {
                            month: 'short',
                            day: '2-digit', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Date not available'}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '13px',
                            color: '#666',
                            fontFamily: 'Poppins',
                          }}
                        >
                          {post.location ? 
                            (typeof post.location === 'object' && (post.location.city || post.location.state) ? 
                              `${post.location.city || ''} ${post.location.state ? `, ${post.location.state}` : ''}`.trim() : 
                              typeof post.location === 'string' ? post.location : 'Location not available'
                            ) : 
                            (post.city || post.state ? 
                              `${post.city || ''} ${post.state ? `, ${post.state}` : ''}`.trim() : 
                              'Location not available'
                            )
                          }
                        </Typography>
                      </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={3} align="center">
                    No rejected posts found
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default RejectedPosts; 