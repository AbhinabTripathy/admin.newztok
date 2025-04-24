import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Link,
  CircularProgress,
} from '@mui/material';
import {
  GridView as DashboardIcon,
  Description as DocumentIcon,
  Schedule as PendingIcon,
  CheckCircle as ApprovedIcon,
  Edit as EditIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { format, parseISO } from 'date-fns';

const StatCard = ({ title, value, icon, color, bgColor, isLoading }) => (
  <Card
    sx={{
      flex: { xs: '1 1 100%', md: 1 },
      p: 2.5,
      borderRadius: 3,
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s ease',
      background: title === 'Total Posts' 
        ? 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)'
        : title === 'Pending Review'
        ? 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)'
        : 'linear-gradient(135deg, #23D393 0%, #00B871 100%)',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
      },
    }}
  >
    <Box>
      <Typography
        sx={{
          color: '#FFFFFF',
          fontSize: '14px',
          mb: 0.5,
          fontFamily: 'Poppins',
          fontWeight: 400,
          opacity: 0.9,
        }}
      >
        {title}
      </Typography>
      {isLoading ? (
        <CircularProgress size={32} sx={{ color: '#FFFFFF' }} />
      ) : (
        <Typography
          variant="h3"
          sx={{
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '32px',
            fontFamily: 'Poppins',
          }}
        >
          {value}
        </Typography>
      )}
    </Box>
    <Box
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'rotate(10deg)',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
      }}
    >
      {React.cloneElement(icon, { sx: { ...icon.props.sx, color: '#FFFFFF', fontSize: 20 } })}
    </Box>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0
  });
  
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date from API response
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString || 'N/A';
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Get the authentication token stored during login
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No authentication token found in localStorage');
          setError('Authentication required. Please login again.');
          setLoading(false);
          return;
        }

        console.log('Fetching dashboard stats with auth token...');
        // Make authenticated API request with the token
        const response = await axios.get('https://api.newztok.in/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        console.log('Dashboard stats response received:', response.data);
        
        // Log the full response structure to debug
        console.log('Full API response structure:', JSON.stringify(response.data, null, 2));
        
        // From the log, we can see the actual structure is:
        // { status: 200, success: true, message: 'Dashboard statistics fetched successfully', data: {...} }
        // So the actual data is inside the 'data' property
        
        if (response.data && response.data.data && response.data.data.posts) {
          // Update state with the counts from the correct API structure
          setStats({
            total: response.data.data.posts.total || 0,
            pending: response.data.data.posts.pending || 0,
            approved: response.data.data.posts.approved || 0
          });
          console.log('Updated stat counts:', {
            total: response.data.data.posts.total,
            pending: response.data.data.posts.pending,
            approved: response.data.data.posts.approved
          });
        } else if (response.data && response.data.data) {
          // Try if posts stats are direct properties of data object
          const data = response.data.data;
          
          if (data.total !== undefined && data.pending !== undefined && data.approved !== undefined) {
            setStats({
              total: data.total || 0,
              pending: data.pending || 0,
              approved: data.approved || 0
            });
            console.log('Found stats directly in data object');
          }
          // Check if data contains a posts object
          else if (data.posts) {
            const postsData = data.posts;
            if (typeof postsData === 'object') {
              // Try to extract stats from posts
              setStats({
                total: postsData.total || 0,
                pending: postsData.pending || 0,
                approved: postsData.approved || 0
              });
              console.log('Found stats in data.posts object');
            }
          } else {
            console.warn('Could not find post counts in the API response structure');
            console.log('Available data keys:', Object.keys(data));
          }
        } else {
          console.warn('API response missing expected data structure');
          setError('Invalid data received from server');
        }
        
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        if (err.response && err.response.status === 401) {
          console.error('Authentication token expired or invalid');
          // Clear invalid token
          localStorage.removeItem('token');
          setError('Your session has expired. Please login again.');
        } else {
          setError('Failed to load dashboard statistics');
        }
      } finally {
        setLoading(false);
      }
    };

    // Fetch stats when component mounts
    fetchStats();
  }, []);

  // Fetch pending posts
  useEffect(() => {
    const fetchPendingPosts = async () => {
      try {
        setPostsLoading(true);
        // Get the authentication token stored during login
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No authentication token found for fetching pending posts');
          setPostsLoading(false);
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
        
        // Extract pending posts from the response
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Use the data array from the response
          setPendingPosts(response.data.data.slice(0, 10)); // Get first 10 posts
          console.log('Updated pending posts list with API data');
        } else if (response.data && response.data.data && response.data.data.posts && Array.isArray(response.data.data.posts)) {
          // Alternative structure where posts might be in a nested property
          setPendingPosts(response.data.data.posts.slice(0, 10));
          console.log('Found pending posts in nested data.posts array');
        } else if (response.data && Array.isArray(response.data)) {
          // Direct array in response
          setPendingPosts(response.data.slice(0, 10));
          console.log('Found pending posts directly in response array');
        } else {
          console.warn('Could not find pending posts in the API response');
          console.log('Response structure:', typeof response.data, response.data ? Object.keys(response.data) : 'null');
        }
      } catch (err) {
        console.error('Error fetching pending posts:', err);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPendingPosts();
  }, []);

  // Explicitly ensure values are always strings, with a default of '0'
  const totalPostsValue = stats.total !== undefined ? stats.total.toString() : '0';
  const pendingValue = stats.pending !== undefined ? stats.pending.toString() : '0';
  const approvedValue = stats.approved !== undefined ? stats.approved.toString() : '0';

  return (
    <Box 
      sx={{ 
        p: 3,
        pt: 2,
        mt: '64px',
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        backgroundColor: '#F8F9FA',
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <DashboardIcon 
          sx={{ 
            color: '#6B73FF', 
            mr: 1.5, 
            fontSize: 24,
            position: 'relative',
          }} 
        />
        <Typography
          variant="h4"
          sx={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#1a1a1a',
            fontFamily: 'Poppins',
            position: 'relative',
          }}
        >
          Dashboard
        </Typography>
      </Box>
      
      <Typography
        sx={{
          color: '#666',
          mb: 3,
          fontSize: '14px',
          fontFamily: 'Poppins',
          position: 'relative',
        }}
      >
        Get insights and manage editorial workflows efficiently.
      </Typography>

      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2.5, 
          mb: 3,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        <StatCard
          title="Total Posts"
          value={totalPostsValue}
          icon={<DocumentIcon />}
          color="#FFFFFF"
          bgColor="rgba(255, 255, 255, 0.2)"
          isLoading={loading}
        />
        <StatCard
          title="Pending Review"
          value={pendingValue}
          icon={<PendingIcon />}
          color="#FFFFFF"
          bgColor="rgba(255, 255, 255, 0.2)"
          isLoading={loading}
        />
        <StatCard
          title="Approved"
          value={approvedValue}
          icon={<ApprovedIcon />}
          color="#FFFFFF"
          bgColor="rgba(255, 255, 255, 0.2)"
          isLoading={loading}
        />
      </Box>

      <Box 
        sx={{ 
          mb: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TimeIcon sx={{ color: '#6B73FF', mr: 1, fontSize: 18 }} />
          <Typography
            variant="h6"
            sx={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#1a1a1a',
              fontFamily: 'Poppins',
            }}
          >
            Latest Pending Posts
          </Typography>
        </Box>
        <Link
          href="/pending-posts"
          sx={{
            color: '#6B73FF',
            textDecoration: 'none',
            fontSize: '13px',
            fontFamily: 'Poppins',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            '&:hover': {
              color: '#000DFF',
              textDecoration: 'none',
            },
          }}
        >
          View All
        </Link>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          borderRadius: 2,
          position: 'relative',
          backgroundColor: '#FFFFFF',
          '& .MuiTableCell-root': {
            fontFamily: 'Poppins',
            padding: '12px 16px',
          },
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: '#666',
                  fontSize: '12px',
                  fontWeight: 500,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                  fontFamily: 'Poppins',
                }}
              >
                TITLE
              </TableCell>
              <TableCell
                sx={{
                  color: '#666',
                  fontSize: '12px',
                  fontWeight: 500,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                  fontFamily: 'Poppins',
                }}
              >
                CATEGORY
              </TableCell>
              <TableCell
                sx={{
                  color: '#666',
                  fontSize: '12px',
                  fontWeight: 500,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                  fontFamily: 'Poppins',
                }}
              >
                SUBMITTED
              </TableCell>
              <TableCell
                sx={{
                  color: '#666',
                  fontSize: '12px',
                  fontWeight: 500,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                  fontFamily: 'Poppins',
                }}
              >
                ACTION
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {postsLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} sx={{ color: '#6B73FF' }} />
                </TableCell>
              </TableRow>
            ) : pendingPosts.length > 0 ? (
              pendingPosts.map((post, index) => (
                <TableRow
                  key={post.id || index}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(107, 115, 255, 0.02)',
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      fontSize: '13px',
                      fontWeight: 400,
                      color: '#1a1a1a',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                      fontFamily: 'Poppins',
                    }}
                  >
                    {post.title || 'Untitled Post'}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '13px',
                      fontWeight: 400,
                      color: '#666',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                      textTransform: 'capitalize',
                      fontFamily: 'Poppins',
                    }}
                  >
                    {post.category || 'Uncategorized'}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '13px',
                      fontWeight: 400,
                      color: '#666',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                      fontFamily: 'Poppins',
                    }}
                  >
                    {formatDate(post.created_at || post.submitted || post.date)}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{
                        color: '#6B73FF',
                        transition: 'all 0.3s ease',
                        padding: '6px',
                        '&:hover': {
                          backgroundColor: 'rgba(107, 115, 255, 0.08)',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <EditIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3, color: '#666' }}>
                  No pending posts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dashboard; 