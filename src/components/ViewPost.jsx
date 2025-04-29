import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  styled,
} from '@mui/material';

// API base URL for fetching media
const API_BASE_URL = 'https://api.newztok.in';

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
  // Function to get complete image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return path.startsWith('/') ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`;
  };

  // Function to get YouTube embed URL
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Extract video ID from various YouTube URL formats
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return null;
  };

  // Function to get video URL
  const getVideoUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return path.startsWith('/') ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`;
  };

  // Determine content type from post data
  const isVideoPost = post.contentType === 'video' || 
                     (post.originalData && post.originalData.contentType === 'video') ||
                     post.originalData?.youtubeUrl;

  // Get media URL based on post type
  const featuredImageUrl = getImageUrl(post.featuredImage || 
                                     (post.originalData && post.originalData.featuredImage) || 
                                     (post.originalData && post.originalData.image));
  
  const youtubeUrl = getYoutubeEmbedUrl(post.originalData?.youtubeUrl);
  
  const videoUrl = getVideoUrl(post.originalData?.videoPath || 
                             post.originalData?.video);

  // Function to strip HTML tags from content
  const stripHtmlTags = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  // Get clean content description
  const contentDescription = post.originalData?.content ? 
    stripHtmlTags(post.originalData.content) : 
    (typeof post.description === 'string' ? stripHtmlTags(post.description) : '');

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
            maxHeight: '500px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            overflow: 'hidden',
          }}
        >
          {isVideoPost ? (
            youtubeUrl ? (
              // YouTube embed
              <iframe 
                src={youtubeUrl}
                title="YouTube video player"
                width="100%"
                height="400px"
                style={{ border: 'none', borderRadius: '4px' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : videoUrl ? (
              // MP4 video
              <video 
                src={videoUrl}
                controls
                width="100%"
                height="400px"
                style={{ objectFit: 'contain', backgroundColor: '#000' }}
              ></video>
            ) : (
              // No video available
              <Box
                sx={{
                  width: '100%',
                  height: '400px',
                  backgroundColor: '#2a2a2a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
            )
          ) : featuredImageUrl ? (
            // Featured image for standard posts
            <img 
              src={featuredImageUrl} 
              alt="Featured" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '500px', 
                objectFit: 'contain'
              }}
              onError={(e) => {
                console.error("Failed to load image:", featuredImageUrl);
                e.target.src = "https://via.placeholder.com/800x400?text=Image+Not+Available";
                e.target.style.maxHeight = "400px";
              }}
            />
          ) : (
            // No media available
            <Box
              sx={{
                width: '100%',
                height: '400px',
                backgroundColor: '#f0f2f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{
                  color: '#666',
                  fontSize: '16px',
                  fontFamily: 'Poppins',
                }}
              >
                No image available
              </Typography>
            </Box>
          )}
        </Box>

        <Typography
          sx={{
            fontSize: '14px',
            color: '#1a1a1a',
            fontFamily: 'Poppins',
            mb: 4,
            lineHeight: 1.6,
          }}
        >
          {contentDescription}
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