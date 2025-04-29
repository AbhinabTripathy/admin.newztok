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
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  // Handle opening the dropdown menu
  const handleMenuOpen = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
    
    // Find the complete post object that corresponds to this ID for more context
    const post = posts.find(p => String(p.id) === String(postId));
    if (post) {
      console.log("Selected post for menu actions:", post);
      setSelectedPost(post);
    } else {
      console.warn(`Post with ID ${postId} not found in posts array`);
    }
  };

  // Handle closing the dropdown menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
    setSelectedPost(null);
  };

  // Handle edit action
  const handleEdit = (postId) => {
    if (!postId) return;
    
    // Find the post to edit from the current posts array
    const postToEdit = posts.find(post => {
      return String(post.id) === String(postId) || String(post._id) === String(postId);
    });
    
    if (postToEdit) {
      console.log("Post to edit (raw data from list):", postToEdit);
      
      // Process the post data for consistency
      const processedPostData = {
        id: postToEdit.id || postToEdit._id,
        title: postToEdit.headline || postToEdit.title || '',
        content: postToEdit.content || '',
        featuredImage: postToEdit.featuredImage || postToEdit.image || '',
        category: postToEdit.category || '',
        state: postToEdit.state || '',
        district: postToEdit.district || '',
        type: postToEdit.type || (postToEdit.youtubeUrl || postToEdit.videoPath ? 'video' : 'standard'),
        contentType: postToEdit.contentType || postToEdit.type || 'standard',
        status: postToEdit.status || 'approved',
        youtubeUrl: postToEdit.youtubeUrl || '',
        thumbnailUrl: postToEdit.thumbnailUrl || '',
        
        // Enhanced video path handling with proper synchronization
        videoPath: postToEdit.videoPath || postToEdit.video || '',
        video: postToEdit.video || postToEdit.videoPath || '',
        videoUrl: postToEdit.videoUrl || '',
        featuredVideo: postToEdit.featuredVideo || '',
        
        // Store original data for reference
        originalVideoData: {
          videoPath: postToEdit.videoPath || '',
          video: postToEdit.video || '',
          videoUrl: postToEdit.videoUrl || '',
          featuredVideo: postToEdit.featuredVideo || ''
        },
        
        // Featured status
        featured: postToEdit.featured || false,
        isFeatured: postToEdit.isFeatured || postToEdit.featured || false
      };
      
      // Log location data for debugging
      console.log("LOCATION DATA BEING PASSED:", {
        state: processedPostData.state,
        district: processedPostData.district,
        originalState: postToEdit.state,
        originalDistrict: postToEdit.district,
        formattedState: postToEdit.formattedState,
        formattedDistrict: postToEdit.formattedDistrict
      });
      
      // Log each video-related field for debugging
      console.log("VIDEO FIELDS BEING PASSED:", {
        videoPath: processedPostData.videoPath,
        video: processedPostData.video,
        videoUrl: processedPostData.videoUrl,
        featuredVideo: processedPostData.featuredVideo,
        originalVideoData: processedPostData.originalVideoData
      });
      
      // Set the appropriate content type if video-related fields are present
      if (postToEdit.type === 'video' || 
          postToEdit.youtubeUrl || 
          postToEdit.videoPath || 
          postToEdit.video || 
          postToEdit.videoUrl || 
          postToEdit.featuredVideo) {
        processedPostData.type = 'video';
        processedPostData.contentType = 'video';
        console.log("Video content detected, setting type to 'video'");
      }
      
      console.log("Processed post data:", processedPostData);
      
      // Navigate to the edit-post route
      navigate(`/edit-post/${postId}`, { state: { newsData: processedPostData } });
    } else {
      console.error(`Post with ID ${postId} not found for editing`);
      alert('Post not found for editing. Please refresh the page and try again.');
    }
    handleMenuClose();
  };

  // Handle mark/unmark trending action
  const handleMarkTrending = async (postId) => {
    if (!postId) return;
    
    try {
      // Find the post to get its current featured status
      const post = posts.find(p => String(p.id) === String(postId));
      if (!post) {
        console.error(`Post with ID ${postId} not found`);
        return;
      }
      
      const currentFeaturedStatus = post.featured || false;
      const newFeaturedStatus = !currentFeaturedStatus;
      
      console.log(`Toggling trending for post ${postId} from ${currentFeaturedStatus} to ${newFeaturedStatus}`);
      
      // Get the auth token
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }
      
      // Optimistically update UI
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (String(post.id) === String(postId)) {
            return {
              ...post,
              featured: newFeaturedStatus,
              isFeatured: newFeaturedStatus
            };
          }
          return post;
        })
      );
      
      // API endpoint for trending
      const endpoint = `https://api.newztok.in/api/news/featured/${postId}`;
      console.log('Making PUT request to:', endpoint);

      // Use native fetch to make the request
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isFeatured: newFeaturedStatus })
      });
      
      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);

      // Store featured status in localStorage for persistence
      if (newFeaturedStatus) {
        localStorage.setItem(`featured_post_${postId}`, 'true');
      } else {
        localStorage.removeItem(`featured_post_${postId}`);
      }
      
      // Show confirmation
      alert(newFeaturedStatus ? 
        'Post marked as trending successfully!' : 
        'Post removed from trending successfully!'
      );
      
      // Refresh posts to ensure everything is in sync
      fetchPosts();
      
    } catch (err) {
      console.error('Error toggling trending status:', err);
      
      // Revert the optimistic UI update
      fetchPosts();
      
      // Show error message
      alert(`Failed to update trending status. ${err.message}`);
    }
    
    handleMenuClose();
  };

  // Handle delete action
  const handleDelete = async (postId) => {
    if (!postId) return;
    
    // Confirm deletion first
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      handleMenuClose();
      return;
    }
    
    try {
      console.log("Trying to delete post:", postId);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        return;
      }

      // Delete endpoint
      const deleteUrl = `https://api.newztok.in/api/news/delete/${postId}`;
      console.log("Making DELETE request to:", deleteUrl);

      const response = await axios({
        method: 'DELETE',
        url: deleteUrl,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Delete response:", response);

      // On successful deletion
      if (response.status === 200 || response.status === 204) {
        // Remove the post from UI
        setPosts(prevPosts => prevPosts.filter(post => 
          String(post.id) !== String(postId)
        ));
        
        // Store deleted post ID in localStorage to prevent re-fetching
        try {
          let deletedPostIds = JSON.parse(localStorage.getItem('deletedPosts') || '[]');
          deletedPostIds.push(postId);
          localStorage.setItem('deletedPosts', JSON.stringify(deletedPostIds));
        } catch (error) {
          console.warn('Could not update deletedPosts in localStorage:', error);
        }
        
        // Show confirmation and refresh posts
        alert('Post deleted successfully!');
      } else {
        throw new Error(`Server returned unexpected status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete post';
      alert(`Failed to delete post: ${errorMessage}. Please try again.`);
    }
    
    handleMenuClose();
  };

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
            locationText = state || district || '';
          }
          
          return {
            id: post.id,
            headline: post.title || 'No Title',
            content: post.content || 'No Content',
            type: post.type || post.postType || 'Standard',
            category: getCategoryLabel(post.category || post.categoryType || 'General'),
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
            createdAt: post.createdAt || post.created_at || new Date().toISOString(),
            featured: post.featured || false,
            // Add the requested fields
            featuredImage: post.featuredImage || null,
            youtubeUrl: post.youtubeUrl || null,
            videoPath: post.videoPath || null
          };
        });
        
        // Sort posts by created date, newest first
        formattedPosts.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
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

  // Helper function to get proper category label
  const getCategoryLabel = (category) => {
    const lowerCategory = (category || '').toLowerCase();
    
    switch(lowerCategory) {
      case 'national':
        return 'राष्ट्रीय | National';
      case 'international':
        return 'अंतर्राष्ट्रीय | International';
      case 'sports':
        return 'खेल | Sports';
      case 'entertainment':
        return 'मनोरंजन | Entertainment';
      default:
        return capitalizeFirstLetter(category);
    }
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
                <StyledTableCell align="right">ACTIONS</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={4} align="center">
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
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: `<div style="font-size:13px; color:#666; margin-bottom:8px; font-family:Poppins; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; text-overflow:ellipsis;">${post.content}</div>` 
                          }}
                        />
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
                        size="small" 
                        onClick={(e) => handleMenuOpen(e, post.id)}
                        aria-label="more options"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dropdown Menu */}
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
        <MenuItem 
          onClick={() => selectedPost && handleEdit(selectedPost.id)} 
          sx={{ 
            padding: '8px 16px',
            minHeight: '40px',
            fontFamily: 'Poppins',
            fontSize: '14px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <ListItemIcon>
            <EditIcon sx={{ fontSize: 20, color: '#FF9800' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Edit Post" 
            primaryTypographyProps={{ 
              style: { 
                fontFamily: 'Poppins',
                fontSize: '14px',
              }
            }}
          />
        </MenuItem>
        
        <MenuItem 
          onClick={() => selectedPost && handleMarkTrending(selectedPost.id)} 
          sx={{ 
            padding: '8px 16px',
            minHeight: '40px',
            fontFamily: 'Poppins',
            fontSize: '14px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <ListItemIcon>
            <TrendingUpIcon sx={{ fontSize: 20, color: '#4CAF50' }} />
          </ListItemIcon>
          <ListItemText 
            primary={selectedPost && selectedPost.featured ? "Remove Trending" : "Mark Trending"} 
            primaryTypographyProps={{ 
              style: { 
                fontFamily: 'Poppins',
                fontSize: '14px',
              }
            }}
          />
        </MenuItem>
        
        <MenuItem 
          onClick={() => selectedPost && handleDelete(selectedPost.id)} 
          sx={{ 
            padding: '8px 16px',
            minHeight: '40px',
            fontFamily: 'Poppins',
            fontSize: '14px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            color: '#ef4444',
          }}
        >
          <ListItemIcon>
            <DeleteIcon sx={{ fontSize: 20, color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Remove" 
            primaryTypographyProps={{ 
              style: { 
                fontFamily: 'Poppins',
                fontSize: '14px',
                color: '#ef4444',
              }
            }}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Posts; 