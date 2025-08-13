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
    additionalImages: [null, null, null, null], // 4 additional image slots
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

  const handleAdditionalImageChange = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => {
        const newAdditionalImages = [...prev.additionalImages];
        newAdditionalImages[index] = e.target.files[0];
        return {
          ...prev,
          additionalImages: newAdditionalImages
        };
      });
    }
  };

  const removeAdditionalImage = (index) => {
    setFormData(prev => {
      const newAdditionalImages = [...prev.additionalImages];
      newAdditionalImages[index] = null;
      return {
        ...prev,
        additionalImages: newAdditionalImages
      };
    });
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
      
      // Core post data - mapping field names correctly
      formDataToSend.append('title', formData.title);           // Headline → title
      formDataToSend.append('category', formData.category);     // Category → category
      formDataToSend.append('state', formData.state);           // State → state
      formDataToSend.append('district', formData.district);     // District → district
      formDataToSend.append('content', formData.content);       // Content → content
      formDataToSend.append('contentType', 'video');            // Set contentType as video
      
      // Add either YouTube URL or video file
      if (formData.youtubeUrl) {
        formDataToSend.append('youtubeUrl', formData.youtubeUrl); // YouTube Link → youtubeUrl
        console.log('Using YouTube URL:', formData.youtubeUrl);
      } else if (videoFile) {
        formDataToSend.append('video', videoFile);
        console.log('Using video file:', videoFile.name, 'Size:', Math.round(videoFile.size / 1024 / 1024) + 'MB');
      }

      // TEMPORARILY DISABLE ADDITIONAL IMAGES TO TEST BASIC VIDEO POST
      const validAdditionalImages = formData.additionalImages.filter(img => img !== null);
      console.log(`Found ${validAdditionalImages.length} additional images - TEMPORARILY DISABLED TO TEST BASIC POST`);
      
      // TODO: Will re-enable after confirming basic video post works without images
      // for (let i = 0; i < validAdditionalImages.length; i++) {
      //   const image = validAdditionalImages[i];
      //   
      //   // Check file size (5MB limit)
      //   if (image.size > 5 * 1024 * 1024) {
      //     throw new Error(`Additional image ${i + 1} size should be less than 5MB`);
      //   }
      //   
      //   // Compress additional image
      //   const compressedAdditionalImage = await compressImage(image);
      //   
      //   // Try different field names that the API might expect
      //   formDataToSend.append(`image${i + 1}`, compressedAdditionalImage);
      //   console.log(`Added additional image ${i + 1} to FormData as image${i + 1}`);
      //   console.log(`Image details:`, {
      //     originalName: image.name,
      //     originalSize: `${(image.size / 1024 / 1024).toFixed(2)} MB`,
      //     compressedSize: `${(compressedAdditionalImage.size / 1024 / 1024).toFixed(2)} MB`,
      //     type: compressedAdditionalImage.type
      //   });
      // }

      // Log request details - showing field mappings
      console.log('Sending request to:', 'https://api.newztok.in/api/news/admin/create');
      console.log('POST Data Field Mappings:', {
        'Headline → title': formData.title,
        'Category → category': formData.category,
        'State → state': formData.state,
        'District → district': formData.district,
        'Content → content': `${formData.content?.length || 0} characters`,
        'YouTube Link → youtubeUrl': formData.youtubeUrl || 'Not provided',
        'Additional Images → image1, image2, etc.': `${validAdditionalImages.length} images (TEMPORARILY DISABLED)`,
        'contentType': 'video'
      });
      
      if (validAdditionalImages.length > 0) {
        console.log('Additional images:', validAdditionalImages.map((img, index) => ({
          index: index + 1,
          name: img.name,
          size: `${(img.size / 1024 / 1024).toFixed(2)} MB`,
          type: img.type
        })));
      }

      // Log final FormData contents
      console.log('Final FormData being sent to API:');
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            size: `${(value.size / 1024 / 1024).toFixed(2)} MB`,
            type: value.type
          });
        } else {
          console.log(`${key}:`, value);
        }
      }

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
          additionalImages: [null, null, null, null], // Reset additional images
        });
        setVideoFile(null);
        setPreviewUrl('');
        
        // Clear all file inputs
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
          input.value = '';
        });
        
        // Clear TinyMCE editor
        if (editorRef.current) {
          editorRef.current.setContent('');
        }
      } else {
        // Even if we got a 200 response, check if there's an error message in the response
        setError(response.data.message || 'Failed to create post. Please check all fields and try again.');
      }
    } catch (err) {
      console.error('Error creating video post:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        responseData: err.response?.data,
        url: err.config?.url,
        method: err.config?.method
      });
      
      if (err.response?.status === 400) {
        // Handle Bad Request error
        const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Invalid request format';
        console.error('Bad Request Error:', errorMessage);
        setError(`Bad Request: ${errorMessage}`);
      } else if (err.response) {
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
                State
              </Typography>
              <StyledSelect name="state" value={formData.state} onChange={handleChange} required>
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
                disabled={!formData.state}
                required
              >
                <option value="">---------</option>
                {formData.state && DISTRICTS[formData.state] && DISTRICTS[formData.state].map(district => (
                  <option key={district.value} value={district.value}>{district.label}</option>
                ))}
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

          {/* Additional Images Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#666',
                fontFamily: 'Poppins',
                mb: 2,
                fontWeight: 500,
              }}
            >
              Additional Images (Optional - Max 4)
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
              {formData.additionalImages.map((image, index) => (
                <Box key={index}>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      color: '#888',
                      fontFamily: 'Poppins',
                      mb: 1,
                    }}
                  >
                    Additional Image {index + 1}
                  </Typography>
                  <Box
                    sx={{
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      borderRadius: '4px',
                      p: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <UploadButton component="label" size="small">
                      Choose File
                      <input 
                        type="file" 
                        hidden 
                        accept="image/*" 
                        onChange={(e) => handleAdditionalImageChange(index, e)}
                      />
                    </UploadButton>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#666',
                        fontFamily: 'Poppins',
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {image ? image.name : 'no file selected'}
                    </Typography>
                    {image && (
                      <Button
                        size="small"
                        onClick={() => removeAdditionalImage(index)}
                        sx={{
                          minWidth: 'auto',
                          p: 0.5,
                          color: '#FF3B30',
                          fontSize: '12px',
                        }}
                      >
                        ✕
                      </Button>
                    )}
                  </Box>
                </Box>
              ))}
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

          <PublishButton type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : '🚀 Publish Video Post'}
          </PublishButton>
        </form>
      </Paper>
    </Box>
  );
};

export default VideoPost; 