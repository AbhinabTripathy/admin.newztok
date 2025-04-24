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
  Paper,
  styled,
  CircularProgress,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

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

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get('https://api.newztok.in/api/news/public', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('API Response:', response.data);
      
      if (response.data && response.data.data) {
        // Format the data to match our component structure
        const formattedPosts = response.data.data.map(post => {
          // Format location data from state and district with capitalized first letters
          const state = post.state ? capitalizeFirstLetter(post.state) : '';
          const district = post.district ? capitalizeFirstLetter(post.district) : '';
          let locationText = '';
          
          if (state && district) {
            // Show state first, then district
            locationText = `${state} | ${district}`;
          } else if (state) {
            locationText = state;
          } else if (district) {
            locationText = district;
          } else {
            locationText = 'Location not specified';
          }
          
          return {
            headline: post.title || 'No Title',
            description: post.description || 'No Description',
            type: post.postType || 'Standard',
            category: post.categoryType || 'Uncategorized',
            author: post.journalist?.username || post.editor?.username || post.admin?.username || 'Unknown',
            location: locationText,
            state: state,
            district: district,
            date: new Date(post.createdAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            featured: post.featured || false
          };
        });
        
        setPosts(formattedPosts);
      } else {
        setPosts([]);
        setError('No posts found');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.response?.data?.message || 'Failed to fetch posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>HEADLINE</StyledTableCell>
                <StyledTableCell>TYPE / CATEGORY</StyledTableCell>
                <StyledTableCell>AUTHOR</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={3} align="center">
                    <Typography sx={{ py: 3, fontFamily: 'Poppins' }}>
                      No posts found
                    </Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                posts.map((post, index) => (
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
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Posts; 