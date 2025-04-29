import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  styled,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
} from '@mui/material';
import { VideoLibrary as VideoIcon, Article as ArticleIcon } from '@mui/icons-material';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

// API base URL configuration
const API_BASE_URL = 'https://api.newztok.in';

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
  backgroundColor: '#4CAF50',
  color: '#fff',
  padding: '8px 24px',
  '&:hover': {
    backgroundColor: '#43A047',
  },
});

const STATES = [
  { value: 'bihar', label: 'बिहार | Bihar' },
  { value: 'uttar pradesh', label: 'उत्तर प्रदेश | Uttar Pradesh' },
  { value: 'jharkhand', label: 'झारखंड | Jharkhand' }
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

const EditPost = ({ post, onPublish }) => {
  const editorRef = useRef(null);
  
  // Use originalData if available, otherwise use the post directly
  const postData = post?.originalData || post;
  
  // Post fields with full details
  const [formData, setFormData] = useState({
    headline: '',
    title: '',
    category: '',
    state: 'bihar',
    district: '',
    youtubeUrl: '',
    videoPath: '',
    featuredImage: '',
    thumbnailUrl: '',
    content: '',
    contentType: 'standard', // 'standard' or 'video'
  });
  
  // UI state
  const [isVideoContent, setIsVideoContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadMethod, setUploadMethod] = useState('youtube'); // 'youtube' or 'file'
  const [newVideo, setNewVideo] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Monitor when post data changes and update form
  useEffect(() => {
    if (post) {
      console.log('Post data received in EditPost:', post);
      
      // Extract data, first trying originalData if it exists
      const data = post.originalData || post;
      
      // Determine if this is a video post
      const isVideo = 
        data.contentType === 'video' || 
        data.type === 'video' || 
        !!data.youtubeUrl || 
        !!data.videoPath || 
        !!data.video;
      
      // Choose upload method based on existing data
      let uploadMethodValue = 'youtube';
      if (data.videoPath || data.video) {
        uploadMethodValue = 'file';
      } else if (data.youtubeUrl) {
        uploadMethodValue = 'youtube';
      }
      
      // Update state with all relevant fields
      setFormData({
        headline: data.title || data.headline || '',
        title: data.title || data.headline || '',
        category: data.category || data.categoryType || '',
        state: (data.state || '').toLowerCase() || 'bihar',
        district: (data.district || '').toLowerCase() || '',
        youtubeUrl: data.youtubeUrl || '',
        videoPath: data.videoPath || data.video || '',
        featuredImage: data.featuredImage || data.image || '',
        thumbnailUrl: data.thumbnailUrl || '',
        content: data.content || data.description || '',
        contentType: isVideo ? 'video' : 'standard',
      });
      
      setIsVideoContent(isVideo);
      setUploadMethod(uploadMethodValue);
      
      console.log("Set values:", {
        headline: data.title || data.headline,
        category: data.category || data.categoryType,
        state: (data.state || '').toLowerCase(),
        district: (data.district || '').toLowerCase(),
        contentType: isVideo ? 'video' : 'standard',
        uploadMethod: uploadMethodValue
      });
    }
  }, [post]);

  // Handle changing field values
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle switching post type
  const handlePostTypeChange = (newType) => {
    setIsVideoContent(newType === 'video');
    handleInputChange('contentType', newType);
  };

  // Handle video upload method selection
  const handleUploadMethodChange = (method) => {
    setUploadMethod(method);
    if (method === 'youtube') {
      setNewVideo(null);
    }
  };

  // Handle selecting a new video file
  const handleVideoFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        setError('Video size should be less than 50MB');
        return;
      }
      
      // Validate file type
      if (!file.type.includes('video/')) {
        setError('Please select a valid video file');
        return;
      }
      
      setNewVideo(file);
      setUploadMethod('file');
      handleInputChange('youtubeUrl', ''); // Clear YouTube URL if video file is selected
      
      setSuccess(`Video selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  // Handle selecting a new image file
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.includes('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      setNewImage(file);
      setSuccess(`Image selected: ${file.name}`);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  // Handle form submission
  const handlePublish = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }
      
      // Check if we need to use FormData (for file uploads)
      const hasNewFile = (isVideoContent && uploadMethod === 'file' && newVideo) || newImage;
      
      if (hasNewFile) {
        // Use FormData for file uploads
        const formDataToSend = new FormData();
        
        // Add basic fields
        formDataToSend.append('id', post.id || post._id);
        formDataToSend.append('title', formData.title.trim());
        formDataToSend.append('category', formData.category.trim());
        formDataToSend.append('state', formData.state.toLowerCase().trim());
        formDataToSend.append('district', formData.district.toLowerCase().trim());
        formDataToSend.append('content', formData.content);
        formDataToSend.append('contentType', formData.contentType);
        formDataToSend.append('status', 'approved');
        
        // Include any existing paths that shouldn't change
        if (formData.featuredImage && !newImage) {
          formDataToSend.append('featuredImage', formData.featuredImage);
        }
        
        // For video content
        if (isVideoContent) {
          if (uploadMethod === 'youtube') {
            formDataToSend.append('youtubeUrl', formData.youtubeUrl || '');
          } else {
            if (newVideo) {
              formDataToSend.append('video', newVideo);
            } else if (formData.videoPath) {
              formDataToSend.append('videoPath', formData.videoPath || '');
            }
          }
        }
        
        // Add new image if selected
        if (newImage) {
          formDataToSend.append('featuredImage', newImage);
        }
        
        // Send the request with progress tracking
        const response = await axios({
          method: 'PUT',
          url: `${API_BASE_URL}/api/news/admin/edit/${post.id || post._id}`,
          data: formDataToSend,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentComplete);
            }
          }
        });
        
        console.log('Update response:', response.data);
        setSuccess('Post updated successfully!');
        
        if (onPublish && typeof onPublish === 'function') {
          const updatedPost = { ...post, ...formData };
          onPublish(updatedPost);
        }
      } else {
        // Use regular JSON for non-file updates
        const updatedData = {
          id: post.id || post._id,
          title: formData.title.trim(),
          content: formData.content,
          category: formData.category.trim(),
          state: formData.state.toLowerCase().trim(),
          district: formData.district.toLowerCase().trim(),
          featuredImage: formData.featuredImage || '',
          contentType: formData.contentType,
          status: 'approved'
        };
        
        // Handle video content
        if (isVideoContent) {
          if (uploadMethod === 'youtube') {
            updatedData.youtubeUrl = formData.youtubeUrl || '';
          } else {
            updatedData.videoPath = formData.videoPath || '';
          }
        }
        
        // Make the API request
        const response = await axios.put(
          `${API_BASE_URL}/api/news/admin/edit/${post.id || post._id}`,
          updatedData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        
        console.log('Update response:', response.data);
        setSuccess('Post updated successfully!');
        
        if (onPublish && typeof onPublish === 'function') {
          const updatedPost = { ...post, ...formData };
          onPublish(updatedPost);
        }
      }
    } catch (err) {
      console.error('Error updating post:', err);
      
      if (err.response) {
        setError(`API Error (${err.response.status}): ${err.response.data.message || 'Failed to update post'}`);
      } else if (err.request) {
        setError('No response received from server. Please check your connection.');
      } else {
        setError(err.message || 'Unknown error occurred');
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Helper function to get YouTube embed URL
  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return url;
  };

  // Helper function to get proper display URL for images and videos
  const getMediaUrl = (path) => {
    if (!path) return '';
    
    // If already a full URL, return as is
    if (path.startsWith('http')) {
      return path;
    }
    
    // If path starts with a slash, append to API base URL
    if (path.startsWith('/')) {
      return `${API_BASE_URL}${path}`;
    }
    
    // Otherwise, append with a slash
    return `${API_BASE_URL}/${path}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          {isVideoContent ? <VideoIcon sx={{ fontSize: 24 }} /> : <ArticleIcon sx={{ fontSize: 24 }} />}
          <Typography
            variant="h4"
            sx={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#1a1a1a',
              fontFamily: 'Poppins',
            }}
          >
            Edit {isVideoContent ? 'Video' : 'Standard'} Post
          </Typography>
        </Box>

        {/* Error and success messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, '& .MuiAlert-message': { fontFamily: 'Poppins' } }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3, '& .MuiAlert-message': { fontFamily: 'Poppins' } }}>
            {success}
          </Alert>
        )}
        
        {/* Upload progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <Box sx={{ 
            backgroundColor: '#f0fdf4', 
            color: '#15803d', 
            padding: '12px', 
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', fontWeight: 500 }}>
              Uploading: {uploadProgress}% complete
            </Typography>
            <Box sx={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#dcfce7', 
              borderRadius: '4px', 
              marginTop: '8px',
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                width: `${uploadProgress}%`, 
                height: '100%', 
                backgroundColor: '#34d399',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </Box>
          </Box>
        )}

        {/* Content type selector */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#666',
              fontFamily: 'Poppins',
              mb: 1,
            }}
          >
            Post Type
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant={!isVideoContent ? 'contained' : 'outlined'}
              onClick={() => handlePostTypeChange('standard')}
              sx={{
                textTransform: 'none',
                fontFamily: 'Poppins',
              }}
            >
              Standard Post
            </Button>
            <Button
              variant={isVideoContent ? 'contained' : 'outlined'}
              onClick={() => handlePostTypeChange('video')}
              sx={{
                textTransform: 'none',
                fontFamily: 'Poppins',
              }}
            >
              Video Post
            </Button>
          </Box>
        </Box>

        {/* Post title */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#666',
              fontFamily: 'Poppins',
              mb: 1,
            }}
          >
            {isVideoContent ? 'Video Title' : 'Headline'}
          </Typography>
          <TextField
            fullWidth
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Poppins',
                fontSize: '14px',
              },
            }}
          />
        </Box>

        {/* Category, State, District selectors */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl fullWidth>
            <StyledInputLabel>Category</StyledInputLabel>
            <StyledSelect
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              label="Category"
            >
              <MenuItem value="entertainment">मनोरंजन | Entertainment</MenuItem>
              <MenuItem value="national">राष्ट्रीय | National</MenuItem>
              <MenuItem value="international">अंतर्राष्ट्रीय | International</MenuItem>
              <MenuItem value="sports">खेल | Sports</MenuItem>
              <MenuItem value="trending">ट्रेंडिंग | Trending</MenuItem>
            </StyledSelect>
          </FormControl>

          <FormControl fullWidth>
            <StyledInputLabel>State</StyledInputLabel>
            <StyledSelect
              value={formData.state}
              onChange={(e) => {
                handleInputChange('state', e.target.value);
                handleInputChange('district', ''); // Reset district when state changes
              }}
              label="State"
            >
              {STATES.map(state => (
                <MenuItem key={state.value} value={state.value}>{state.label}</MenuItem>
              ))}
            </StyledSelect>
          </FormControl>

          <FormControl fullWidth>
            <StyledInputLabel>District</StyledInputLabel>
            <StyledSelect
              value={formData.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
              label="District"
            >
              {formData.state && DISTRICTS[formData.state] && 
                DISTRICTS[formData.state].map(district => (
                  <MenuItem key={district.value} value={district.value}>{district.label}</MenuItem>
                ))
              }
            </StyledSelect>
          </FormControl>
        </Box>

        {/* Different UI based on post type */}
        {isVideoContent ? (
          // VIDEO POST UI
          <>
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3,
                '& .MuiAlert-message': {
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                },
              }}
            >
              Upload a video file or paste a YouTube link like: https://www.youtube.com/watch?v=abc123
            </Alert>

            {/* Video upload method selector */}
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: '#666',
                  fontFamily: 'Poppins',
                  mb: 1,
                }}
              >
                Video Source
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={uploadMethod === 'youtube' ? 'contained' : 'outlined'}
                  onClick={() => handleUploadMethodChange('youtube')}
                  sx={{
                    textTransform: 'none',
                    fontFamily: 'Poppins',
                  }}
                >
                  YouTube URL
                </Button>
                <Button
                  variant={uploadMethod === 'file' ? 'contained' : 'outlined'}
                  onClick={() => handleUploadMethodChange('file')}
                  sx={{
                    textTransform: 'none',
                    fontFamily: 'Poppins',
                  }}
                >
                  Upload MP4 File
                </Button>
              </Box>
            </Box>

            {/* YouTube URL or file upload based on selected method */}
            {uploadMethod === 'youtube' ? (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#666',
                    fontFamily: 'Poppins',
                    mb: 1,
                  }}
                >
                  YouTube URL
                </Typography>
                <TextField
                  fullWidth
                  value={formData.youtubeUrl}
                  onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=example"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontFamily: 'Poppins',
                      fontSize: '14px',
                    },
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#666',
                    fontFamily: 'Poppins',
                    mb: 1,
                  }}
                >
                  Video File <span style={{ fontSize: '12px' }}>(Max 50MB, MP4 only)</span>
                </Typography>
                <Box
                  sx={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '4px',
                    p: 2,
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
                      accept="video/mp4" 
                      onChange={handleVideoFileChange}
                    />
                  </UploadButton>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#666',
                      fontFamily: 'Poppins',
                    }}
                  >
                    {newVideo ? newVideo.name : formData.videoPath ? formData.videoPath.split('/').pop() : 'No file selected'}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Video preview */}
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: '#666',
                  fontFamily: 'Poppins',
                  mb: 1,
                }}
              >
                Video Preview
              </Typography>
              {uploadMethod === 'youtube' && formData.youtubeUrl ? (
                <Box sx={{ width: '100%', height: '300px' }}>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={getEmbedUrl(formData.youtubeUrl)}
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </Box>
              ) : uploadMethod === 'file' && (formData.videoPath || newVideo) ? (
                <Box sx={{ width: '100%', height: '300px' }}>
                  {newVideo ? (
                    <video 
                      width="100%" 
                      height="100%" 
                      controls
                      src={newVideo ? URL.createObjectURL(newVideo) : ''}
                    ></video>
                  ) : (
                    <video 
                      width="100%" 
                      height="100%" 
                      controls
                      src={getMediaUrl(formData.videoPath)}
                    ></video>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#FFF5F5',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px dashed #FF3B30',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#FF3B30',
                      fontSize: '14px',
                      fontFamily: 'Poppins',
                    }}
                  >
                    No video selected
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        ) : (
          // STANDARD POST UI
          <Box sx={{ mb: 3 }}>
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
                p: 2,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <UploadButton component="label">
                  Choose Image
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
                  {newImage ? newImage.name : formData.featuredImage ? formData.featuredImage.split('/').pop() : 'No image selected'}
                </Typography>
              </Box>
              
              {/* Image preview */}
              {(formData.featuredImage || newImage) && (
                <Box 
                  sx={{ 
                    width: '100%', 
                    height: '200px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    backgroundColor: '#f8f9fa',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <img 
                    src={newImage ? URL.createObjectURL(newImage) : getMediaUrl(formData.featuredImage)} 
                    alt="Featured" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain' 
                    }} 
                  />
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* Content editor - common for both types */}
        <Box sx={{ mb: 4 }}>
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
            onInit={(evt, editor) => editorRef.current = editor}
            value={formData.content}
            onEditorChange={(newContent) => handleInputChange('content', newContent)}
            init={{
              height: 400,
              menubar: true,
              plugins: [
                'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 
                'media', 'searchreplace', 'table', 'visualblocks', 'wordcount', 'fullscreen', 'code',
                'help', 'preview'
              ],
              toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat | fullscreen code',
              content_style: 'body { font-family: Poppins, sans-serif; font-size: 14px; }',
            }}
          />
        </Box>

        {/* Submit button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <PublishButton 
            variant="contained" 
            onClick={handlePublish}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Updating...
              </>
            ) : (
              'Update Post'
            )}
          </PublishButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditPost; 