import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { styled } from '@mui/material/styles';
import { VideoCall as VideoCallIcon } from '@mui/icons-material';
import axios from 'axios';

const StyledSelect = styled('select')({
  width: '100%',
  padding: '8px 12px',
  fontSize: '14px',
  fontFamily: 'Poppins',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
  backgroundColor: 'white',
  '&:focus': {
    borderColor: '#2196F3',
    outline: 'none',
  },
  '&:hover': {
    borderColor: 'rgba(0, 0, 0, 0.24)',
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

const VideoPreviewBox = styled(Box)({
  width: '100%',
  height: '200px',
  backgroundColor: '#FFF5F5',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(0, 0, 0, 0.12)',
});

const VideoPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    state: '',
    district: '',
    youtubeUrl: '',
    content: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const editorRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Reset district when state changes
    if (name === 'state') {
      setFormData(prev => ({
        ...prev,
        state: value,
        district: ''
      }));
    }
  };

  const handleEditorChange = (content) => {
    setFormData({
      ...formData,
      content
    });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Check file size (50MB limit = 50 * 1024 * 1024 bytes)
      if (file.size > 50 * 1024 * 1024) {
        setError('Video file must be smaller than 50MB');
        return;
      }
      
      setVideoFile(file);
      
      // Create preview URL for the video
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Clear YouTube URL when file is selected
      setFormData({
        ...formData,
        youtubeUrl: ''
      });
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Headline is required');
      return false;
    }
    
    if (!formData.category) {
      setError('Category is required');
      return false;
    }

    if (!formData.state) {
      setError('State is required');
      return false;
    }

    if (!formData.district) {
      setError('District is required');
      return false;
    }

    if (!formData.content) {
      setError('Content is required');
      return false;
    }

    if (!videoFile && !formData.youtubeUrl) {
      setError('Either a YouTube URL or video file is required');
      return false;
    }

    if (formData.youtubeUrl && !isValidYoutubeUrl(formData.youtubeUrl)) {
      setError('Please enter a valid YouTube URL');
      return false;
    }

    return true;
  };

  const isValidYoutubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      // Log token (truncated for security)
      console.log('Using token (first 10 chars):', token.substring(0, 10) + '...');

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('type', 'video');
      
      // Add either YouTube URL or video file
      if (formData.youtubeUrl) {
        formDataToSend.append('youtubeUrl', formData.youtubeUrl);
        console.log('Using YouTube URL:', formData.youtubeUrl);
      } else if (videoFile) {
        formDataToSend.append('video', videoFile);
        console.log('Using video file:', videoFile.name, 'Size:', Math.round(videoFile.size / 1024 / 1024) + 'MB');
      }

      // Log request details
      console.log('Sending request to:', 'https://api.newztok.in/api/news/admin/create');
      console.log('Request data:', {
        title: formData.title,
        category: formData.category,
        state: formData.state,
        district: formData.district,
        contentLength: formData.content?.length || 0,
        hasVideo: !!videoFile,
        hasYoutubeUrl: !!formData.youtubeUrl
      });

      const response = await axios({
        method: 'POST',
        url: 'https://api.newztok.in/api/news/admin/create',
        data: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          // Optional: track upload progress if needed
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      });
      
      console.log('Post creation response:', response.data);
      
      if (response.data && response.data.success === true) {
        setSuccess(response.data.message || 'Video post created successfully!');
        // Reset form after successful submission
        setFormData({
          title: '',
          category: '',
          state: '',
          district: '',
          youtubeUrl: '',
          content: '',
        });
        setVideoFile(null);
        setPreviewUrl('');
      } else {
        // Even if we got a 200 response, check if there's an error message in the response
        setError(response.data.message || 'Failed to create post. Please check all fields and try again.');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      
      if (err.response) {
        console.log('Error response:', err.response.data);
        setError(err.response.data.message || `Error: ${err.response.status}`);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to create post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Extract YouTube video ID for preview
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Extract video ID from various YouTube URL formats
    let videoId = null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[7].length === 11) {
      videoId = match[7];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return null;
  };
  
  // Determine preview content
  const renderPreview = () => {
    if (previewUrl) {
      // Local video preview
      return (
        <video 
          controls 
          src={previewUrl} 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
        />
      );
    } else if (formData.youtubeUrl) {
      // YouTube embed preview
      const embedUrl = getYoutubeEmbedUrl(formData.youtubeUrl);
      if (embedUrl) {
        return (
          <iframe
            src={embedUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
            title="YouTube video preview"
          />
        );
      }
    }
    
    // Default - no preview
    return (
      <Typography
        sx={{
          fontSize: '14px',
          color: '#FF3B30',
          fontFamily: 'Poppins',
        }}
      >
        No video selected
      </Typography>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <VideoCallIcon sx={{ fontSize: 24 }} />
          <Typography
            variant="h4"
            sx={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#1a1a1a',
              fontFamily: 'Poppins',
            }}
          >
            Create Video Post
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
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
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Write a great headline..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                },
              }}
              required
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 3 }}>
            <Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: '#666',
                  fontFamily: 'Poppins',
                  mb: 1,
                }}
              >
                Category
              </Typography>
              <StyledSelect name="category" value={formData.category} onChange={handleChange} required>
                <option value="">---------</option>
                <option value="national">राष्ट्रीय | National</option>
                <option value="international">अंतरराष्ट्रीय | International</option>
                <option value="sports">खेल | Sports</option>
                <option value="entertainment">मनोरंजन | Entertainment</option>
              </StyledSelect>
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
                State
              </Typography>
              <StyledSelect name="state" value={formData.state} onChange={handleChange} required>
                <option value="">---------</option>
                <option value="bihar">बिहार | Bihar</option>
                <option value="jharkhand">झारखंड | Jharkhand</option>
                <option value="up">उत्तर प्रदेश | Uttar Pradesh</option>
              </StyledSelect>
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
                District
              </Typography>
              <StyledSelect 
                name="district" 
                value={formData.district} 
                onChange={handleChange}
                disabled={!formData.state}
                required
              >
                <option value="">---------</option>
                {formData.state === 'bihar' && (
                  <>
                    <option value="patna">पटना | Patna</option>
                    <option value="gaya">गया | Gaya</option>
                    <option value="munger">मुंगेर | Munger</option>
                    <option value="bhagalpur">भागलपुर | Bhagalpur</option>
                    <option value="purnia">पूर्णिया | Purnia</option>
                    <option value="darbhanga">दरभंगा | Darbhanga</option>
                    <option value="muzaffarpur">मुजफ्फरपुर | Muzaffarpur</option>
                    <option value="saharsa">सहरसा | Saharsa</option>
                    <option value="sitamarhi">सीतामढ़ी | Sitamarhi</option>
                    <option value="vaishali">वैशाली | Vaishali</option>
                    <option value="siwan">सिवान | Siwan</option>
                    <option value="saran">सारण | Saran</option>
                    <option value="gopalganj">गोपालगंज | Gopalganj</option>
                    <option value="begusarai">बेगूसराय | Begusarai</option>
                    <option value="samastipur">समस्तीपुर | Samastipur</option>
                    <option value="madhubani">मधुबनी | Madhubani</option>
                    <option value="supaul">सुपौल | Supaul</option>
                    <option value="araria">अररिया | Araria</option>
                    <option value="kishanganj">किशनगंज | Kishanganj</option>
                    <option value="katihar">कटिहार | Katihar</option>
                    <option value="east-champaran">पूर्वी चंपारण | East Champaran</option>
                    <option value="west-champaran">पश्चिमी चंपारण | West Champaran</option>
                    <option value="sheohar">शिवहर | Sheohar</option>
                    <option value="madhepura">मधेपुरा | Madhepura</option>
                  </>
                )}
                {formData.state === 'jharkhand' && (
                  <>
                    <option value="ranchi">रांची | Ranchi</option>
                    <option value="jamshedpur">जमशेदपुर | Jamshedpur</option>
                    <option value="dhanbad">धनबाद | Dhanbad</option>
                    <option value="bokaro">बोकारो | Bokaro</option>
                    <option value="deoghar">देवघर | Deoghar</option>
                    <option value="hazaribagh">हजारीबाग | Hazaribagh</option>
                    <option value="giridih">गिरिडीह | Giridih</option>
                    <option value="koderma">कोडरमा | Koderma</option>
                    <option value="chatra">चतरा | Chatra</option>
                    <option value="gumla">गुमला | Gumla</option>
                    <option value="latehar">लातेहार | Latehar</option>
                    <option value="lohardaga">लोहरदगा | Lohardaga</option>
                    <option value="pakur">पाकुड़ | Pakur</option>
                    <option value="palamu">पलामू | Palamu</option>
                    <option value="ramgarh">रामगढ़ | Ramgarh</option>
                    <option value="sahibganj">साहिबगंज | Sahibganj</option>
                    <option value="simdega">सिमडेगा | Simdega</option>
                    <option value="singhbhum">सिंहभूम | Singhbhum</option>
                    <option value="seraikela-kharsawan">सरायकेला खरसावां | Seraikela Kharsawan</option>
                    <option value="east-singhbhum">पूर्वी सिंहभूम | East Singhbhum</option>
                    <option value="west-singhbhum">पश्चिमी सिंहभूम | West Singhbhum</option>
                  </>
                )}
                {formData.state === 'up' && (
                  <>
                    <option value="lucknow">लखनऊ | Lucknow</option>
                    <option value="kanpur">कानपुर | Kanpur</option>
                    <option value="agra">आगरा | Agra</option>
                    <option value="varanasi">वाराणसी | Varanasi</option>
                    <option value="prayagraj">प्रयागराज | Prayagraj</option>
                    <option value="meerut">मेरठ | Meerut</option>
                    <option value="noida">नोएडा | Noida</option>
                    <option value="ghaziabad">गाजियाबाद | Ghaziabad</option>
                    <option value="bareilly">बरेली | Bareilly</option>
                    <option value="aligarh">अलीगढ़ | Aligarh</option>
                    <option value="moradabad">मुरादाबाद | Moradabad</option>
                    <option value="saharanpur">सहारनपुर | Saharanpur</option>
                    <option value="gorakhpur">गोरखपुर | Gorakhpur</option>
                    <option value="faizabad">फैजाबाद | Faizabad</option>
                    <option value="jaunpur">जौनपुर | Jaunpur</option>
                    <option value="mathura">मथुरा | Mathura</option>
                    <option value="ballia">बलिया | Ballia</option>
                    <option value="rae-bareli">रायबरेली | Rae Bareli</option>
                    <option value="sultanpur">सुल्तानपुर | Sultanpur</option>
                    <option value="fatehpur">फतेहपुर | Fatehpur</option>
                    <option value="pratapgarh">प्रतापगढ़ | Pratapgarh</option>
                    <option value="kaushambi">कौशाम्बी | Kaushambi</option>
                    <option value="jhansi">झांसी | Jhansi</option>
                    <option value="lalitpur">ललितपुर | Lalitpur</option>
                  </>
                )}
              </StyledSelect>
            </Box>
          </Box>

          <Alert 
            severity="info" 
            sx={{ 
              mb: 3, 
              backgroundColor: '#FFF5F5',
              color: '#FF3B30',
              '& .MuiAlert-icon': {
                color: '#FF3B30'
              },
              border: '1px solid #FFE4E4',
            }}
          >
            Upload a video file (max 50MB) or paste a YouTube link like: https://www.youtube.com/watch?v=abc123
            <br />
            Avoid using shortened links like youtu.be.
          </Alert>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
            <Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: '#666',
                  fontFamily: 'Poppins',
                  mb: 1,
                }}
              >
                Upload Video File (max 50MB)
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
                  <input 
                    type="file" 
                    hidden 
                    accept="video/*" 
                    onChange={handleVideoChange}
                  />
                </UploadButton>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#666',
                    fontFamily: 'Poppins',
                  }}
                >
                  {videoFile ? videoFile.name : 'no file selected'}
                </Typography>
              </Box>
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
                YouTube Link
              </Typography>
              <TextField
                fullWidth
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                disabled={!!videoFile}
                placeholder="https://www.youtube.com/watch?v=abc123"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#666',
                fontFamily: 'Poppins',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              Video Preview
            </Typography>
            <VideoPreviewBox sx={{ height: '300px' }}>
              {renderPreview()}
            </VideoPreviewBox>
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
              apiKey="omxjaluaxpgfpa6xkfadimoprrirfmhozsrtpb3o1uimu4c5"
              onInit={(evt, editor) => {
                editorRef.current = editor;
              }}
              value={formData.content}
              onEditorChange={handleEditorChange}
              init={{
                height: 300,
                menubar: true,
                plugins: [
                  'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 
                  'media', 'searchreplace', 'table', 'visualblocks', 'wordcount', 'fullscreen', 'code',
                  'help', 'preview'
                ],
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat | fullscreen code',
                content_style: 'body { font-family: Poppins, sans-serif; font-size: 14px; }',
                images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
                  const token = localStorage.getItem('token');
                  if (!token) {
                    reject('No token found. Please login again.');
                    return;
                  }
                  
                  const formData = new FormData();
                  formData.append('file', blobInfo.blob(), blobInfo.filename());
                  
                  axios.post('https://api.newztok.in/api/upload', formData, {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    },
                    onUploadProgress: (e) => {
                      progress(e.loaded / e.total * 100);
                    }
                  })
                  .then(response => {
                    resolve(response.data.url);
                  })
                  .catch(error => {
                    reject('Image upload failed: ' + error.message);
                  });
                }),
                file_picker_types: 'image',
                file_picker_callback: function(cb, value, meta) {
                  const input = document.createElement('input');
                  input.setAttribute('type', 'file');
                  input.setAttribute('accept', 'image/*');
                  
                  input.onchange = function() {
                    const file = this.files[0];
                    const reader = new FileReader();
                    
                    reader.onload = function() {
                      const id = 'blobid' + (new Date()).getTime();
                      const blobCache = editorRef.current.editorUpload.blobCache;
                      const base64 = reader.result.split(',')[1];
                      const blobInfo = blobCache.create(id, file, base64);
                      blobCache.add(blobInfo);
                      
                      cb(blobInfo.blobUri(), { title: file.name });
                    };
                    reader.readAsDataURL(file);
                  };
                  
                  input.click();
                }
              }}
            />
          </Box>

          <PublishButton type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : '🚀 Publish Video Post'}
          </PublishButton>
        </form>
      </Paper>
    </Box>
  );
};

export default VideoPost; 