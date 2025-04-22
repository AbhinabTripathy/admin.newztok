import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StatusText = styled(Typography)({
  color: '#FF3B30',
  fontFamily: 'Poppins',
  fontSize: '14px',
  fontWeight: 500,
});

const ActionButton = styled(Button)(({ color = 'default' }) => ({
  textTransform: 'none',
  fontFamily: 'Poppins',
  fontSize: '14px',
  padding: '8px 16px',
  borderRadius: '4px',
  minWidth: '100px',
  ...(color === 'default' && {
    backgroundColor: '#f8f9fa',
    color: '#666',
    '&:hover': {
      backgroundColor: '#e9ecef',
    },
  }),
  ...(color === 'primary' && {
    backgroundColor: '#2196F3',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1976D2',
    },
  }),
  ...(color === 'success' && {
    backgroundColor: '#4CAF50',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#43A047',
    },
  }),
}));

const RejectedViewPost = ({ post, onBack, onEdit, onApproveReject }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: '32px',
            fontWeight: 600,
            color: '#1a1a1a',
            mb: 3,
            fontFamily: 'Poppins',
          }}
        >
          Test 1
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#666',
                fontFamily: 'Poppins',
              }}
            >
              Author:
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#2196F3',
                fontFamily: 'Poppins',
                fontWeight: 500,
              }}
            >
              Rajesh Suresh
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#666',
                fontFamily: 'Poppins',
              }}
            >
              Submitted At:
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#1a1a1a',
                fontFamily: 'Poppins',
              }}
            >
              April 3, 2025, noon
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#666',
                fontFamily: 'Poppins',
              }}
            >
              Status:
            </Typography>
            <StatusText>
              Rejected
            </StatusText>
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: '15px',
            color: '#1a1a1a',
            mb: 4,
            fontFamily: 'Poppins',
          }}
        >
          Royal Enfield
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <ActionButton onClick={onBack}>
            Back
          </ActionButton>
          <ActionButton color="primary" onClick={onEdit}>
            Edit
          </ActionButton>
          <ActionButton color="success" onClick={onApproveReject}>
            Approve / Reject
          </ActionButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default RejectedViewPost; 