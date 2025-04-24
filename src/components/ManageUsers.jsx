import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Button,
  styled,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontSize: '13px',
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

const ManageUsers = () => {
  const navigate = useNavigate();
  const [editors, setEditors] = useState([]);
  const [journalists, setJournalists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    user: null
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Get the authentication token stored during login
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No authentication token found for fetching users');
          setError('Authentication required. Please login again.');
          setLoading(false);
          return;
        }

        // Log partial token for debugging (first and last 5 chars)
        const tokenPrefix = token.substring(0, 5);
        const tokenSuffix = token.substring(token.length - 5);
        console.log(`Using token: ${tokenPrefix}...${tokenSuffix} (length: ${token.length})`);
        
        // Check if token looks valid (basic check)
        if (token.length < 20 || !token.includes('.')) {
          console.error('Token appears malformed:', tokenPrefix + '...' + tokenSuffix);
          setError('Your authentication token appears invalid. Please log in again.');
          setLoading(false);
          return;
        }
        
        console.log('Fetching users with auth token...');
        // Make authenticated API request with the token
        const response = await axios.get('https://api.newztok.in/api/dashboard/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        console.log('Users response received:', response.data);
        
        // More robust handling of various response data structures
        if (response.data) {
          let editorsData = [];
          let journalistsData = [];
          
          // Check different possible data structures
          if (response.data.data && response.data.data.editors) {
            // Original structure: response.data.data.editors
            editorsData = response.data.data.editors || [];
            journalistsData = response.data.data.journalists || [];
          } else if (response.data.editors) {
            // Alternative structure: response.data.editors
            editorsData = response.data.editors || [];
            journalistsData = response.data.journalists || [];
          } else if (Array.isArray(response.data.data)) {
            // Structure where data is an array of users with roles
            const allUsers = response.data.data;
            editorsData = allUsers.filter(user => user.role?.toLowerCase() === 'editor');
            journalistsData = allUsers.filter(user => user.role?.toLowerCase() === 'journalist');
          } else if (Array.isArray(response.data)) {
            // Direct array structure
            const allUsers = response.data;
            editorsData = allUsers.filter(user => user.role?.toLowerCase() === 'editor');
            journalistsData = allUsers.filter(user => user.role?.toLowerCase() === 'journalist');
          }
          
          console.log('Processed editors:', editorsData);
          console.log('Processed journalists:', journalistsData);
          
          setEditors(editorsData);
          setJournalists(journalistsData);
          setError(null);
        } else {
          console.warn('Unexpected API response format');
          setError('Unable to load users. Unexpected data format received.');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        
        // Log detailed error information
        if (err.response) {
          console.log('Error response status:', err.response.status);
          console.log('Error response data:', err.response.data);
          console.log('Error response headers:', err.response.headers);
          
          // Handle specific error codes
          if (err.response.status === 403) {
            console.log('403 Forbidden error - Token might be invalid or expired');
            setError('Authentication failed. Your session may have expired. Please log out and log in again.');
          } else if (err.response.status === 401) {
            console.log('401 Unauthorized error - Token is invalid');
            setError('Your session has expired. Please log in again.');
          } else {
            setError(`Failed to load users: ${err.response.data?.message || 'Unknown error'}`);
          }
        } else if (err.request) {
          console.log('No response received:', err.request);
          setError('Failed to connect to the server. Please check your internet connection and try again.');
        } else {
          console.log('Error setting up request:', err.message);
          setError('Failed to load users. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  
  const openDeleteDialog = (user) => {
    setDeleteDialog({
      open: true,
      user
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      user: null
    });
  };
  
  const handleDeleteUser = async () => {
    const user = deleteDialog.user;
    if (!user) return;
    
    try {
      console.log('Deleting user:', user);
      
      // Get the authentication token stored during login
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found for deleting user');
        setSnackbar({
          open: true,
          message: 'Authentication required. Please login again.',
          severity: 'error'
        });
        closeDeleteDialog();
        return;
      }
      
      // Show loading message
      setSnackbar({
        open: true,
        message: 'Deleting user...',
        severity: 'info'
      });
      
      // Close the dialog immediately
      closeDeleteDialog();
      
      // Format the URL properly - ensure the user ID is correctly extracted and formatted
      const userId = user.id;
      console.log(`Attempting to delete user with ID: ${userId}`);
      
      // Make DELETE request to delete the user
      const response = await axios({
        method: 'DELETE',
        url: `https://api.newztok.in/api/dashboard/users/${userId}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Delete response:', response.data);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
      
      // Update the lists by removing the deleted user
      if (user.role?.toLowerCase() === 'editor') {
        setEditors(editors.filter(editor => editor.id !== userId));
      } else if (user.role?.toLowerCase() === 'journalist') {
        setJournalists(journalists.filter(journalist => journalist.id !== userId));
      } else {
        // If role is not specified, try to remove from both arrays
        setEditors(editors.filter(editor => editor.id !== userId));
        setJournalists(journalists.filter(journalist => journalist.id !== userId));
      }
      
    } catch (err) {
      console.error('Error deleting user:', err);
      console.log('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      let errorMessage = 'Failed to delete user. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later or contact support.';
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const renderTable = (users, title) => (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontFamily: 'Poppins',
          fontSize: '18px',
          fontWeight: 600,
          color: '#1a1a1a',
        }}
      >
        {title}
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Phone</StyledTableCell>
              <StyledTableCell>State</StyledTableCell>
              <StyledTableCell>District</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <StyledTableRow key={user.id}>
                  <StyledTableCell>{user.name || 'N/A'}</StyledTableCell>
                  <StyledTableCell>{user.phone || 'N/A'}</StyledTableCell>
                  <StyledTableCell>{user.state || 'N/A'}</StyledTableCell>
                  <StyledTableCell>{user.district || 'N/A'}</StyledTableCell>
                  <StyledTableCell>{user.email || 'N/A'}</StyledTableCell>
                  <StyledTableCell>
                    <span style={{
                      backgroundColor: user.status === 'active' ? '#E8F5E9' : '#FFEBEE',
                      color: user.status === 'active' ? '#4CAF50' : '#F44336',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}>
                      {user.status || 'unknown'}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      onClick={() => openDeleteDialog(user)}
                      startIcon={<DeleteIcon />}
                      sx={{
                        color: '#FF3B30',
                        fontFamily: 'Poppins',
                        fontSize: '13px',
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 59, 48, 0.08)',
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  {loading ? 'Loading users...' : 'No users found'}
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'Poppins',
            fontSize: '24px',
            fontWeight: 600,
            color: '#1a1a1a',
          }}
        >
          Manage Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create-user')}
          sx={{
            backgroundColor: '#FF0000',
            fontFamily: 'Poppins',
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            '&:hover': {
              backgroundColor: '#E60000',
            },
          }}
        >
          Add User
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress sx={{ color: '#FF3B30' }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          {renderTable(editors, 'Editors')}
          {renderTable(journalists, 'Journalists')}
        </>
      )}
      
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
      >
        <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: 'Poppins' }}>
            Are you sure you want to permanently delete this user? This action cannot be undone.
            {deleteDialog.user && (
              <Box component="span" sx={{ display: 'block', mt: 1, fontWeight: 500 }}>
                User: {deleteDialog.user.name}
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={closeDeleteDialog}
            sx={{ fontFamily: 'Poppins', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteUser}
            sx={{ 
              fontFamily: 'Poppins', 
              textTransform: 'none',
              color: '#FF3B30',
              '&:hover': {
                backgroundColor: 'rgba(255, 59, 48, 0.08)',
              },
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity || 'info'} 
          sx={{ width: '100%', fontFamily: 'Poppins' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageUsers; 