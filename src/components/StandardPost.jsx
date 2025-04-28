import React, { useState, useRef } from 'react';
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

const STATES = [
  { value: 'bihar', label: 'बिहार | Bihar' },
  { value: 'jharkhand', label: 'झारखंड | Jharkhand' },
  { value: 'uttar pradesh', label: 'उत्तर प्रदेश | Uttar Pradesh' }
];

const DISTRICTS = {
  jharkhand: [
    { value: 'ranchi', label: 'रांची | Ranchi' },
    { value: 'jamshedpur', label: 'जमशेदपुर | Jamshedpur' },
    { value: 'dhanbad', label: 'धनबाद | Dhanbad' },
    { value: 'bokaro', label: 'बोकारो | Bokaro' },
    { value: 'deoghar', label: 'देवघर | Deoghar' },
    { value: 'hazaribagh', label: 'हजारीबाग | Hazaribagh' },
    { value: 'giridih', label: 'गिरिडीह | Giridih' },
    { value: 'koderma', label: 'कोडरमा | Koderma' },
    { value: 'chatra', label: 'चतरा | Chatra' },
    { value: 'gumla', label: 'गुमला | Gumla' },
    { value: 'latehar', label: 'लातेहार | Latehar' },
    { value: 'lohardaga', label: 'लोहरदगा | Lohardaga' },
    { value: 'pakur', label: 'पाकुड़ | Pakur' },
    { value: 'palamu', label: 'पलामू | Palamu' },
    { value: 'ramgarh', label: 'रामगढ़ | Ramgarh' },
    { value: 'sahibganj', label: 'साहिबगंज | Sahibganj' },
    { value: 'simdega', label: 'सिमडेगा | Simdega' },
    { value: 'singhbhum', label: 'सिंहभूम | Singhbhum' },
    { value: 'seraikela-kharsawan', label: 'सरायकेला खरसावां | Seraikela Kharsawan' },
    { value: 'east-singhbhum', label: 'पूर्वी सिंहभूम | East Singhbhum' },
    { value: 'west-singhbhum', label: 'पश्चिमी सिंहभूम | West Singhbhum' },
    { value: 'dumka', label: 'दुमका | Dumka' },
    { value: 'garhwa', label: 'गढ़वा | Garhwa' },
    { value: 'godda', label: 'गोड्डा | Godda' }
  ],
  bihar: [
    { value: 'patna', label: 'पटना | Patna' },
    { value: 'gaya', label: 'गया | Gaya' },
    { value: 'munger', label: 'मुंगेर | Munger' },
    { value: 'bhagalpur', label: 'भागलपुर | Bhagalpur' },
    { value: 'purnia', label: 'पूर्णिया | Purnia' },
    { value: 'darbhanga', label: 'दरभंगा | Darbhanga' },
    { value: 'muzaffarpur', label: 'मुजफ्फरपुर | Muzaffarpur' },
    { value: 'saharsa', label: 'सहरसा | Saharsa' },
    { value: 'sitamarhi', label: 'सीतामढ़ी | Sitamarhi' },
    { value: 'vaishali', label: 'वैशाली | Vaishali' },
    { value: 'siwan', label: 'सिवान | Siwan' },
    { value: 'saran', label: 'सारण | Saran' },
    { value: 'gopalganj', label: 'गोपालगंज | Gopalganj' },
    { value: 'begusarai', label: 'बेगूसराय | Begusarai' },
    { value: 'samastipur', label: 'समस्तीपुर | Samastipur' },
    { value: 'madhubani', label: 'मधुबनी | Madhubani' },
    { value: 'supaul', label: 'सुपौल | Supaul' },
    { value: 'araria', label: 'अररिया | Araria' },
    { value: 'kishanganj', label: 'किशनगंज | Kishanganj' },
    { value: 'katihar', label: 'कटिहार | Katihar' },
    { value: 'east-champaran', label: 'पूर्वी चंपारण | East Champaran' },
    { value: 'west-champaran', label: 'पश्चिमी चंपारण | West Champaran' },
    { value: 'sheohar', label: 'शिवहर | Sheohar' },
    { value: 'madhepura', label: 'मधेपुरा | Madhepura' },
    { value: 'arwal', label: 'अरवल | Arwal' },
    { value: 'aurangabad', label: 'औरंगाबाद | Aurangabad' },
    { value: 'banka', label: 'बांका | Banka' },
    { value: 'bhojpur', label: 'भोजपुर | Bhojpur' },
    { value: 'buxar', label: 'बक्सर | Buxar' },
    { value: 'jamui', label: 'जमुई | Jamui' },
    { value: 'jehanabad', label: 'जहानाबाद | Jehanabad' },
    { value: 'kaimur', label: 'कैमूर | Kaimur' },
    { value: 'khagaria', label: 'खगड़िया | Khagaria' },
    { value: 'lakhisarai', label: 'लखीसराय | Lakhisarai' },
    { value: 'nalanda', label: 'नालंदा | Nalanda' },
    { value: 'nawada', label: 'नवादा | Nawada' },
    { value: 'rohtas', label: 'रोहतास | Rohtas' },
    { value: 'sheikhpura', label: 'शेखपुरा | Sheikhpura' }
  ],
  'uttar pradesh': [
    { value: 'lucknow', label: 'लखनऊ | Lucknow' },
    { value: 'kanpur', label: 'कानपुर | Kanpur' },
    { value: 'agra', label: 'आगरा | Agra' },
    { value: 'varanasi', label: 'वाराणसी | Varanasi' },
    { value: 'prayagraj', label: 'प्रयागराज | Prayagraj' },
    { value: 'meerut', label: 'मेरठ | Meerut' },
    { value: 'noida', label: 'नोएडा | Noida' },
    { value: 'ghaziabad', label: 'गाजियाबाद | Ghaziabad' },
    { value: 'bareilly', label: 'बरेली | Bareilly' },
    { value: 'aligarh', label: 'अलीगढ़ | Aligarh' },
    { value: 'moradabad', label: 'मुरादाबाद | Moradabad' },
    { value: 'saharanpur', label: 'सहारनपुर | Saharanpur' },
    { value: 'gorakhpur', label: 'गोरखपुर | Gorakhpur' },
    { value: 'faizabad', label: 'फैजाबाद | Faizabad' },
    { value: 'jaunpur', label: 'जौनपुर | Jaunpur' },
    { value: 'mathura', label: 'मथुरा | Mathura' },
    { value: 'ballia', label: 'बलिया | Ballia' },
    { value: 'rae-bareli', label: 'रायबरेली | Rae Bareli' },
    { value: 'sultanpur', label: 'सुल्तानपुर | Sultanpur' },
    { value: 'fatehpur', label: 'फतेहपुर | Fatehpur' },
    { value: 'pratapgarh', label: 'प्रतापगढ़ | Pratapgarh' },
    { value: 'kaushambi', label: 'कौशाम्बी | Kaushambi' },
    { value: 'jhansi', label: 'झांसी | Jhansi' },
    { value: 'lalitpur', label: 'ललितपुर | Lalitpur' },
    { value: 'ambedkar-nagar', label: 'अंबेडकर नगर | Ambedkar Nagar' },
    { value: 'amethi', label: 'अमेठी | Amethi' },
    { value: 'amroha', label: 'अमरोहा | Amroha' },
    { value: 'auraiya', label: 'औरैया | Auraiya' },
    { value: 'ayodhya', label: 'अयोध्या | Ayodhya' },
    { value: 'azamgarh', label: 'आजमगढ़ | Azamgarh' },
    { value: 'baghpat', label: 'बागपत | Baghpat' },
    { value: 'bahraich', label: 'बहराइच | Bahraich' },
    { value: 'balrampur', label: 'बलरामपुर | Balrampur' },
    { value: 'banda', label: 'बांदा | Banda' },
    { value: 'barabanki', label: 'बाराबंकी | Barabanki' },
    { value: 'basti', label: 'बस्ती | Basti' },
    { value: 'bhadohi', label: 'भदोही | Bhadohi' },
    { value: 'bijnor', label: 'बिजनौर | Bijnor' },
    { value: 'budaun', label: 'बदायूं | Budaun' },
    { value: 'bulandshahr', label: 'बुलंदशहर | Bulandshahr' },
    { value: 'chandauli', label: 'चंदौली | Chandauli' },
    { value: 'chitrakoot', label: 'चित्रकूट | Chitrakoot' },
    { value: 'deoria', label: 'देवरिया | Deoria' },
    { value: 'etah', label: 'एटा | Etah' },
    { value: 'etawah', label: 'इटावा | Etawah' },
    { value: 'farrukhabad', label: 'फर्रुखाबाद | Farrukhabad' },
    { value: 'firozabad', label: 'फिरोजाबाद | Firozabad' },
    { value: 'gautam-buddha-nagar', label: 'गौतम बुद्ध नगर | Gautam Buddha Nagar' },
    { value: 'ghazipur', label: 'गाजीपुर | Ghazipur' },
    { value: 'gonda', label: 'गोंडा | Gonda' },
    { value: 'hamirpur', label: 'हमीरपुर | Hamirpur' },
    { value: 'hapur', label: 'हापुड़ | Hapur' },
    { value: 'hardoi', label: 'हरदोई | Hardoi' },
    { value: 'hathras', label: 'हाथरस | Hathras' },
    { value: 'jalaun', label: 'जालौन | Jalaun' },
    { value: 'kannauj', label: 'कन्नौज | Kannauj' },
    { value: 'kanpur-dehat', label: 'कानपुर देहात | Kanpur Dehat' },
    { value: 'kanpur-nagar', label: 'कानपुर नगर | Kanpur Nagar' },
    { value: 'kasganj', label: 'कासगंज | Kasganj' },
    { value: 'kheri', label: 'खीरी | Kheri' },
    { value: 'kushinagar', label: 'कुशीनगर | Kushinagar' },
    { value: 'mahoba', label: 'महोबा | Mahoba' },
    { value: 'mahrajganj', label: 'महराजगंज | Mahrajganj' },
    { value: 'mainpuri', label: 'मैनपुरी | Mainpuri' },
    { value: 'mau', label: 'मऊ | Mau' },
    { value: 'mirzapur', label: 'मिर्जापुर | Mirzapur' },
    { value: 'muzaffarnagar', label: 'मुजफ्फरनगर | Muzaffarnagar' },
    { value: 'pilibhit', label: 'पीलीभीत | Pilibhit' },
    { value: 'rampur', label: 'रामपुर | Rampur' },
    { value: 'sambhal', label: 'संभल | Sambhal' },
    { value: 'sant-kabir-nagar', label: 'संत कबीर नगर | Sant Kabir Nagar' },
    { value: 'shahjahanpur', label: 'शाहजहांपुर | Shahjahanpur' },
    { value: 'shamli', label: 'शामली | Shamli' },
    { value: 'shrawasti', label: 'श्रावस्ती | Shrawasti' },
    { value: 'siddharthnagar', label: 'सिद्धार्थनगर | Siddharthnagar' },
    { value: 'sitapur', label: 'सीतापुर | Sitapur' },
    { value: 'sonbhadra', label: 'सोनभद्र | Sonbhadra' },
    { value: 'unnao', label: 'उन्नाव | Unnao' }
  ]
};

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
  const editorRef = useRef(null);

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
        baseURL: 'https://api.newztok.in',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: 50 * 1024 * 1024, // 50MB
        maxBodyLength: 50 * 1024 * 1024, // 50MB
      });

      const response = await axiosInstance.post('/api/news/admin/create', formDataToSend);

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
                <option value="trending">ट्रेंडिंग | Trending</option>
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
                {STATES.map(state => (
                  <option key={state.value} value={state.value}>{state.label}</option>
                ))}
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
                {formData.state === 'bihar' && DISTRICTS.bihar.map(district => (
                  <option key={district.value} value={district.value}>{district.label}</option>
                ))}
                {formData.state === 'jharkhand' && DISTRICTS.jharkhand.map(district => (
                  <option key={district.value} value={district.value}>{district.label}</option>
                ))}
                {formData.state === 'uttar pradesh' && DISTRICTS['uttar pradesh'].map(district => (
                  <option key={district.value} value={district.value}>{district.label}</option>
                ))}
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