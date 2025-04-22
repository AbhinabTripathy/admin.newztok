import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { styled } from '@mui/material/styles';
import { Edit as EditIcon } from '@mui/icons-material';

const StyledSelect = styled(Select)({
  '& .MuiSelect-select': {
    fontFamily: 'Poppins',
    fontSize: '14px',
    padding: '8px 12px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.24)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#2196F3',
  },
});

const StyledInputLabel = styled(InputLabel)({
  fontFamily: 'Poppins',
  fontSize: '14px',
  transform: 'translate(12px, 9px) scale(1)',
  '&.Mui-focused': {
    color: '#2196F3',
  },
  '&.MuiInputLabel-shrink': {
    transform: 'translate(12px, -9px) scale(0.75)',
  },
});

const UploadButton = styled(Button)({
  textTransform: 'none',
  fontFamily: 'Poppins',
  fontSize: '14px',
  backgroundColor: '#FFE4E4',
  color: '#FF3B30',
  padding: '6px 16px',
  '&:hover': {
    backgroundColor: '#FFD5D5',
  },
});

const PublishButton = styled(Button)({
  textTransform: 'none',
  fontFamily: 'Poppins',
  fontSize: '14px',
  backgroundColor: '#FF3B30',
  color: '#fff',
  padding: '8px 24px',
  width: '100%',
  '&:hover': {
    backgroundColor: '#E62E28',
  },
});

const RejectedEditPostScreen = ({ post, onPublish }) => {
  const [selectedState, setSelectedState] = useState('bihar');
  const [selectedDistrict, setSelectedDistrict] = useState('patna');

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <EditIcon sx={{ fontSize: 24 }} />
          <Typography
            variant="h4"
            sx={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#1a1a1a',
              fontFamily: 'Poppins',
            }}
          >
            Create Standard Post
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#666',
              fontFamily: 'Poppins',
              mb: 1,
            }}
          >
            Headline
          </Typography>
          <TextField
            fullWidth
            defaultValue="Test 1"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Poppins',
                fontSize: '14px',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <Box>
            <FormControl fullWidth>
              <StyledInputLabel>Category</StyledInputLabel>
              <StyledSelect
                value="entertainment"
                label="Category"
              >
                <MenuItem value="entertainment">मनोरंजन | Entertainment</MenuItem>
              </StyledSelect>
            </FormControl>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#666',
                fontFamily: 'Poppins',
                mb: 1,
              }}
            >
              Featured Image
            </Typography>
            <Box
              sx={{
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '4px',
                p: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <UploadButton component="label">
                Choose File
                <input type="file" hidden accept="image/*" />
              </UploadButton>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: '#666',
                  fontFamily: 'Poppins',
                }}
              >
                no file selected
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <FormControl fullWidth>
            <StyledInputLabel>State</StyledInputLabel>
            <StyledSelect
              value={selectedState}
              onChange={handleStateChange}
              label="State"
            >
              <MenuItem value="bihar">बिहार | Bihar</MenuItem>
            </StyledSelect>
          </FormControl>

          <FormControl fullWidth>
            <StyledInputLabel>District</StyledInputLabel>
            <StyledSelect
              value={selectedDistrict}
              onChange={handleDistrictChange}
              label="District"
            >
              <MenuItem value="patna">पटना | Patna</MenuItem>
            </StyledSelect>
          </FormControl>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#666',
              fontFamily: 'Poppins',
              mb: 1,
            }}
          >
            Content
          </Typography>
          <Editor
            apiKey="vbil1yv26sci3hwbqs4ctc1ahy85mj03vnl4etxiinf9sk0h"
            initialValue="Royal Enfield"
            init={{
              height: 300,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic underline | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | link image | code | fullscreen',
              content_style: 'body { font-family: Poppins, sans-serif; font-size: 14px; }',
              skin: 'oxide',
              content_css: 'default',
            }}
          />
        </Box>

        <PublishButton onClick={onPublish}>
          🚀 Publish Standard Post
        </PublishButton>
      </Paper>
    </Box>
  );
};

export default RejectedEditPostScreen; 