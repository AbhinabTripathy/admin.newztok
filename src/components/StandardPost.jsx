import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { styled } from '@mui/material/styles';
import { Edit as EditIcon } from '@mui/icons-material';
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

const StandardPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    featuredImage: null,
    state: '',
    district: '',
    content: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        featuredImage: e.target.files[0]
      }));
    }
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('Error: No token found in localStorage');
        throw new Error('Please login again. Your session has expired.');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('content', formData.content);
      
      // Handle image upload separately if it exists
      if (formData.featuredImage) {
        // Check file size (5MB limit)
        if (formData.featuredImage.size > 5 * 1024 * 1024) {
          throw new Error('Image size should be less than 5MB');
        }
        // Compress image if needed
        const compressedImage = await compressImage(formData.featuredImage);
        formDataToSend.append('featuredImage', compressedImage);
      }

      console.log('Sending POST request with data:', {
        title: formData.title,
        category: formData.category,
        state: formData.state,
        district: formData.district,
        hasFeaturedImage: !!formData.featuredImage
      });

      // Create axios instance with default config
      const axiosInstance = axios.create({
        baseURL: '/api',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: 50 * 1024 * 1024, // 50MB
        maxBodyLength: 50 * 1024 * 1024, // 50MB
      });

      const response = await axiosInstance.post('/news/create', formDataToSend);

      console.log('API Response:', response.data);

      if (response.status === 200 || response.status === 201) {
        console.log('Post created successfully!');
        setSuccess('Post created successfully!');
        // Reset form
        setFormData({
          title: '',
          category: '',
          featuredImage: null,
          state: '',
          district: '',
          content: '',
        });
      }
    } catch (err) {
      console.error('Error details:', {
        status: err.response?.status,
        message: err.response?.data?.message,
        data: err.response?.data
      });

      if (err.response?.status === 413) {
        console.log('File too large error');
        setError('The file you are trying to upload is too large. Please upload a file smaller than 5MB.');
      } else if (err.response?.status === 403) {
        console.log('Access denied error:', err.response.data);
        if (err.response?.data?.message === 'Access denied. Insufficient privileges') {
          setError(
            <div>
              <p>You don't have permission to create posts.</p>
              <p>Please contact your administrator to:</p>
              <ul>
                <li>Verify your account has the correct role</li>
                <li>Grant you the necessary permissions</li>
                <li>Check if your account is properly activated</li>
              </ul>
            </div>
          );
        } else {
          setError('Access denied. Please check your permissions or login again.');
        }
      } else if (err.response?.status === 401) {
        console.log('Authentication error: Session expired');
        setError('Your session has expired. Please login again.');
      } else if (err.response?.data?.message) {
        console.log('API error message:', err.response.data.message);
        setError(err.response.data.message);
      } else if (err.message) {
        console.log('General error:', err.message);
        setError(err.message);
      } else {
        console.log('Unknown error occurred');
        setError('Failed to create post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add image compression function
  const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas dimensions
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          const maxWidth = 1200;
          const maxHeight = 1200;
          
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress image
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          }, 'image/jpeg', 0.7);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
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
              required
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
              <StyledSelect
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
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
                  <input 
                    type="file" 
                    hidden 
                    accept="image/*" 
                    onChange={handleImageChange}
                  />
                </UploadButton>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#666',
                    fontFamily: 'Poppins',
                  }}
                >
                  {formData.featuredImage ? formData.featuredImage.name : 'no file selected'}
                </Typography>
              </Box>
            </Box>
          </Box>

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
                State
              </Typography>
              <StyledSelect 
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              >
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
              value={formData.content}
              onEditorChange={handleEditorChange}
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

          <PublishButton
            type="submit"
            disabled={loading}
          >
            {loading ? 'Publishing...' : '🚀 Publish Standard Post'}
          </PublishButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default StandardPost; 