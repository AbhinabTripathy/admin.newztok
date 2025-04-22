import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

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

// Updated sample data with email and role fields
const editors = [
  {
    id: 1,
    name: 'Rajesh Kumar Pattanaik',
    phone: 'dummy_13',
    email: 'rajesheditor@newztok.com',
    role: 'Editor',
    state: 'बिहार | Bihar',
    district: 'अररिया | Araria',
  },
  {
    id: 2,
    name: 'Amit Singh',
    phone: '+91 9876543211',
    email: 'amit@newztok.com',
    role: 'Editor',
    state: 'बिहार | Bihar',
    district: 'गया | Gaya',
  },
];

const journalists = [
  {
    id: 1,
    name: 'Priya Sharma',
    phone: '+91 9876543212',
    email: 'priya@newztok.com',
    role: 'Journalist',
    state: 'बिहार | Bihar',
    district: 'मुजफ्फरपुर | Muzaffarpur',
  },
  {
    id: 2,
    name: 'Vikram Verma',
    phone: '+91 9876543213',
    email: 'vikram@newztok.com',
    role: 'Journalist',
    state: 'बिहार | Bihar',
    district: 'दरभंगा | Darbhanga',
  },
];

const ManageUsers = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleAction = (action) => {
    if (action === 'edit' && selectedUser) {
      navigate(`/manage-users/edit/${selectedUser.id}`, { state: { user: selectedUser } });
    } else if (action === 'delete') {
      // Handle delete action
      console.log('Delete user:', selectedUser);
    }
    handleMenuClose();
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
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <StyledTableRow key={user.id}>
                <StyledTableCell>{user.name}</StyledTableCell>
                <StyledTableCell>{user.phone}</StyledTableCell>
                <StyledTableCell>{user.state}</StyledTableCell>
                <StyledTableCell>{user.district}</StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, user)}
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

      {renderTable(editors, 'Editors')}
      {renderTable(journalists, 'Journalists')}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 0.5,
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
            borderRadius: '4px',
            minWidth: '160px',
          },
        }}
      >
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
              },
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
            <DeleteIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{
              style: {
                fontFamily: 'Poppins',
                fontSize: '14px',
              },
            }}
          />
        </StyledMenuItem>
      </Menu>
    </Box>
  );
};

export default ManageUsers; 