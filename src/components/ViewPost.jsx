import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  styled,
} from '@mui/material';

const StatusChip = styled('span')({
  color: '#FF9800',
  fontFamily: 'Poppins',
  fontSize: '14px',
  fontWeight: 500,
});

const ActionButton = styled(Button)(({ variant }) => ({
  textTransform: 'none',
  fontFamily: 'Poppins',
  fontSize: '14px',
  fontWeight: 500,
  padding: '8px 16px',
  borderRadius: '4px',
  minWidth: '120px',
  ...(variant === 'back' && {
    backgroundColor: '#f8f9fa',
    color: '#666',
    '&:hover': {
      backgroundColor: '#f0f1f2',
    },
  }),
  ...(variant === 'edit' && {
    backgroundColor: '#2196F3',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1976D2',
    },
  }),
  ...(variant === 'approve' && {
    backgroundColor: '#4CAF50',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#43A047',
    },
  }),
}));

const ViewPost = ({ post, onBack, onEdit, onApproveReject }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
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
          {post.headline}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography
            component="span"
            sx={{
              fontSize: '14px',
              color: '#666',
              fontFamily: 'Poppins',
              mr: 1,
            }}
          >
            Author:
          </Typography>
          <Typography
            component="span"
            sx={{
              fontSize: '14px',
              color: '#1a1a1a',
              fontFamily: 'Poppins',
            }}
          >
            {post.author}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography
            component="span"
            sx={{
              fontSize: '14px',
              color: '#666',
              fontFamily: 'Poppins',
              mr: 1,
            }}
          >
            Submitted At:
          </Typography>
          <Typography
            component="span"
            sx={{
              fontSize: '14px',
              color: '#1a1a1a',
              fontFamily: 'Poppins',
            }}
          >
            {`${post.date}, ${post.submittedAt}`}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            component="span"
            sx={{
              fontSize: '14px',
              color: '#666',
              fontFamily: 'Poppins',
              mr: 1,
            }}
          >
            Status:
          </Typography>
          <StatusChip>Pending</StatusChip>
        </Box>

        {/* Video/Content Section */}
        <Box 
          sx={{ 
            width: '100%',
            height: '400px',
            backgroundColor: '#2a2a2a',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Typography
            sx={{
              color: '#fff',
              fontSize: '16px',
              fontFamily: 'Poppins',
            }}
          >
            Video unavailable
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: '14px',
            color: '#1a1a1a',
            fontFamily: 'Poppins',
            mb: 4,
          }}
        >
          {post.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <ActionButton variant="back" onClick={onBack}>
            Back
          </ActionButton>
          <ActionButton variant="edit" onClick={onEdit}>
            Edit
          </ActionButton>
          <ActionButton variant="approve" onClick={onApproveReject}>
            Approve / Reject
          </ActionButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewPost; 