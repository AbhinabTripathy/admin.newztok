import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { styled } from '@mui/material/styles';
import { Edit as EditIcon, VideoLibrary as VideoIcon } from '@mui/icons-material';
import axios from 'axios';

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

// API base URL configuration
const API_BASE_URL = 'https://api.newztok.in';

const AdminEditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const editorRef = useRef(null);
  
  // Extract news data from location state if available
  const newsDataFromState = location.state?.newsData;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    featuredImage: null,
    state: '',
    district: '',
    content: '',
    type: 'standard',
    youtubeUrl: '',
    videoPath: '',
  });
  
  const [newImage, setNewImage] = useState(null);
  const [newVideo, setNewVideo] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('youtube');
  const [isVideoContent, setIsVideoContent] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  useEffect(() => {
    if (newsDataFromState) {
      console.log('Using post data from navigation state:', newsDataFromState);
      setPost(newsDataFromState);
      
      // Initialize form data from the passed state
      const isVideo = newsDataFromState.type === 'video' || !!newsDataFromState.youtubeUrl || !!newsDataFromState.videoPath;
      
      // Normalize category value to match dropdown options
      let normalizedCategory = (newsDataFromState.category || '').toLowerCase();
      console.log('Original category from state:', newsDataFromState.category);
      console.log('Normalized category:', normalizedCategory);
      
      // Handle possible category variations
      if (normalizedCategory.includes('national') || normalizedCategory.includes('राष्ट्रीय')) {
        normalizedCategory = 'national';
      } else if (normalizedCategory.includes('international') || normalizedCategory.includes('अंतर्राष्ट्रीय')) {
        normalizedCategory = 'international';
      } else if (normalizedCategory.includes('sports') || normalizedCategory.includes('खेल')) {
        normalizedCategory = 'sports';
      } else if (normalizedCategory.includes('entertainment') || normalizedCategory.includes('मनोरंजन')) {
        normalizedCategory = 'entertainment';
      }
      
      console.log('Final normalized category:', normalizedCategory);
      
      // Normalize state value 
      let stateValue = (newsDataFromState.state || '').toLowerCase().trim();
      console.log('Original state from state param:', newsDataFromState.state);
      console.log('Normalized state value:', stateValue);
      
      // Validate state against available options
      const validState = STATES.some(s => s.value === stateValue);
      if (!validState && stateValue) {
        console.warn(`State "${stateValue}" not found in valid states, trying to match...`);
        // Try to find a match
        for (const state of STATES) {
          if (state.label.toLowerCase().includes(stateValue)) {
            stateValue = state.value;
            console.log(`Matched state to: ${stateValue}`);
            break;
          }
        }
      }
      
      // Normalize district value
      let districtValue = (newsDataFromState.district || '').toLowerCase().trim();
      console.log('Original district from state param:', newsDataFromState.district);
      console.log('Normalized district value:', districtValue);
      
      // Validate district if we have a valid state
      if (stateValue && districtValue) {
        const districts = DISTRICTS[stateValue] || [];
        const validDistrict = districts.some(d => d.value === districtValue);
        
        if (!validDistrict) {
          console.warn(`District "${districtValue}" not found in valid districts for state "${stateValue}", trying to match...`);
          // Try to find a match
          for (const district of districts) {
            if (district.label.toLowerCase().includes(districtValue)) {
              districtValue = district.value;
              console.log(`Matched district to: ${districtValue}`);
              break;
            }
          }
        }
      }
      
      setFormData({
        title: newsDataFromState.title || '',
        category: normalizedCategory,
        state: stateValue,
        district: districtValue,
        content: newsDataFromState.content || '',
        type: isVideo ? 'video' : 'standard',
        youtubeUrl: newsDataFromState.youtubeUrl || '',
        videoPath: newsDataFromState.videoPath || newsDataFromState.video || '',
        featuredImage: newsDataFromState.featuredImage || '',
      });
      
      setIsVideoContent(isVideo);
      
      if (isVideo) {
        if (newsDataFromState.youtubeUrl) {
          setUploadMethod('youtube');
        } else if (newsDataFromState.videoPath || newsDataFromState.video) {
          setUploadMethod('file');
        }
      }
      
      setLoading(false);
    } else if (postId) {
      console.log('No data in navigation state, fetching post with ID:', postId);
      fetchPostDetails();
    } else {
      setError('No post ID provided');
      setLoading(false);
    }
  }, [postId, newsDataFromState]);
  
  useEffect(() => {
    if (post) {
      console.log('VIDEO PATH UPDATE:', {
        videoPath: post.videoPath,
        video: post.video,
        contentType: post.type,
        uploadMethod
      });
      
      if (post.videoPath && (
          post.videoPath.includes('/uploads/videos/video-') ||
          post.videoPath.includes('uploads/videos/video-')
      )) {
        console.log('Video path detected with the proper format, setting upload method to file');
        setUploadMethod('file');
      }
    }
  }, [post?.videoPath, post?.video, uploadMethod]);
  
  useEffect(() => {
    // This effect handles validation of state and district combinations
    if (formData.state) {
      console.log(`Validating state: ${formData.state}`);
      
      // Check if state is valid
      const validState = STATES.some(s => s.value === formData.state.toLowerCase());
      
      if (!validState) {
        console.warn(`Invalid state "${formData.state}" detected in form data. Resetting to bihar.`);
        setFormData(prev => ({
          ...prev,
          state: 'bihar',
          district: ''
        }));
        return;
      }
      
      // If district is set, validate it against the current state
      if (formData.district) {
        console.log(`Validating district: ${formData.district} for state: ${formData.state}`);
        
        const stateKey = formData.state.toLowerCase();
        const districts = DISTRICTS[stateKey] || [];
        
        if (districts.length === 0) {
          console.warn(`No districts found for state "${stateKey}"`);
          setFormData(prev => ({
            ...prev,
            district: ''
          }));
          return;
        }
        
        const validDistrict = districts.some(d => d.value === formData.district.toLowerCase());
        
        if (!validDistrict) {
          console.warn(`District "${formData.district}" is not valid for state "${formData.state}". Resetting district.`);
          setFormData(prev => ({
            ...prev,
            district: ''
          }));
        } else {
          console.log(`District "${formData.district}" is valid for state "${formData.state}"`);
        }
      }
    }
  }, [formData.state, formData.district]);
  
  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }
      
      console.log(`Fetching post details for ID: ${postId}`);
      
      const response = await axios.get(`https://api.newztok.in/api/news/public/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      console.log('Post details response:', response.data);
      
      if (response.data && response.data.success) {
        const responseData = response.data.data || response.data;
        
        setPost(responseData);
        
        console.log('FULL POST DATA:', JSON.stringify(responseData, null, 2));

        const title = responseData.title || responseData.headline || '';
        let category = responseData.category || responseData.categoryType || '';
        
        // Normalize category value to match dropdown options
        let normalizedCategory = category.toLowerCase();
        console.log('Original category from API:', category);
        console.log('Normalized category from API:', normalizedCategory);
        
        // Handle possible category variations
        if (normalizedCategory.includes('national') || normalizedCategory.includes('राष्ट्रीय')) {
          normalizedCategory = 'national';
        } else if (normalizedCategory.includes('international') || normalizedCategory.includes('अंतर्राष्ट्रीय')) {
          normalizedCategory = 'international';
        } else if (normalizedCategory.includes('sports') || normalizedCategory.includes('खेल')) {
          normalizedCategory = 'sports';
        } else if (normalizedCategory.includes('entertainment') || normalizedCategory.includes('मनोरंजन')) {
          normalizedCategory = 'entertainment';
        }
        
        console.log('Final normalized API category:', normalizedCategory);
        
        // Get and normalize state data
        const stateRaw = responseData.state || '';
        let stateValue = stateRaw.toLowerCase().trim();
        console.log('Original state from API:', stateRaw);
        console.log('Normalized state value:', stateValue);
        
        // Validate state against available options
        const validState = STATES.some(s => s.value === stateValue);
        if (!validState && stateValue) {
          console.warn(`State "${stateValue}" not found in valid states, trying to match...`);
          // Try to find a match based on label
          for (const state of STATES) {
            if (state.label.toLowerCase().includes(stateValue)) {
              stateValue = state.value;
              console.log(`Matched state to: ${stateValue}`);
              break;
            }
          }
          
          // If still no match, default to bihar
          if (!STATES.some(s => s.value === stateValue)) {
            console.warn(`No match found for state "${stateValue}", defaulting to "bihar"`);
            stateValue = 'bihar';
          }
        }
        
        // Get and normalize district data
        const districtRaw = responseData.district || '';
        let districtValue = districtRaw.toLowerCase().trim();
        console.log('Original district from API:', districtRaw);
        console.log('Normalized district value:', districtValue);
        
        // Validate district if we have a valid state
        if (stateValue && districtValue) {
          const districts = DISTRICTS[stateValue] || [];
          const validDistrict = districts.some(d => d.value === districtValue);
          
          if (!validDistrict) {
            console.warn(`District "${districtValue}" not found in valid districts for state "${stateValue}", trying to match...`);
            // Try to find a match based on label
            for (const district of districts) {
              if (district.label.toLowerCase().includes(districtValue)) {
                districtValue = district.value;
                console.log(`Matched district to: ${districtValue}`);
                break;
              }
            }
            
            // If still no match, clear district
            if (!districts.some(d => d.value === districtValue)) {
              console.warn(`No match found for district "${districtValue}" in state "${stateValue}", clearing district`);
              districtValue = '';
            }
          }
        }
        
        // CRITICAL CHECK: If category is Entertainment, force it to be a standard post
        if (normalizedCategory === 'entertainment') {
          console.log('ENTERTAINMENT POST DETECTED - Setting as STANDARD post');
          
          // Set as standard post and update form
          setIsVideoContent(false);
          
          setFormData({
            title,
            category: normalizedCategory,
            state: stateValue,
            district: districtValue,
            content: responseData.content || responseData.description || '',
            type: 'standard',
            youtubeUrl: '',
            videoPath: '',
            featuredImage: responseData.featuredImage || responseData.image || '',
          });
          
          setLoading(false);
          return; // Exit early - don't do any video detection
        }

        // For all other posts, continue with normal processing
        const videoFields = {
          videoPath: responseData.videoPath || null,
          video: responseData.video || null,
          featuredVideo: responseData.featuredVideo || null,
          videoUrl: responseData.videoUrl || null,
          youtubeUrl: responseData.youtubeUrl || null,
        };
        
        console.log('Found video fields in API response:', videoFields);
        console.log('Category found:', normalizedCategory);
        
        console.log('- videoPath:', responseData.videoPath);
        console.log('- video:', responseData.video);
        console.log('- featuredVideo:', responseData.featuredVideo);
        console.log('- videoUrl:', responseData.videoUrl);
        console.log('- youtubeUrl:', responseData.youtubeUrl);
        console.log('- type:', responseData.type || responseData.postType);
        console.log('- featuredImage:', responseData.featuredImage || responseData.image);
        
        const bestVideoPath = responseData.videoPath || responseData.video || responseData.featuredVideo || responseData.videoUrl || '';
        
        const featuredImage = responseData.featuredImage || responseData.image || '';
        const hasVideoContent = !!responseData.youtubeUrl || !!bestVideoPath;
        
        // Only non-entertainment posts can be videos
        const isVideo = hasVideoContent || responseData.type === 'video' || responseData.postType === 'video';
        
        setIsVideoContent(isVideo);
        
        setFormData({
          title,
          category: normalizedCategory,
          state: stateValue,
          district: districtValue,
          content: responseData.content || responseData.description || '',
          type: isVideo ? 'video' : 'standard',
          youtubeUrl: responseData.youtubeUrl || '',
          videoPath: bestVideoPath,
          featuredImage: featuredImage,
        });
        
        if (isVideo) {
          if (responseData.youtubeUrl) {
            setUploadMethod('youtube');
          } else if (bestVideoPath) {
            setUploadMethod('file');
          } else {
            setUploadMethod('file');
          }
        }
      } else {
        setError('Failed to fetch post details: ' + (response.data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error fetching post details:', err);
      
      if (err.response) {
        console.log('Error response:', err.response.status, err.response.data);
        setError(`API Error (${err.response.status}): ${err.response.data.message || 'Failed to fetch post'}`);
      } else if (err.request) {
        setError('No response received from server. Please check your connection.');
      } else {
        setError(err.message || 'Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'state') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        district: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };
  
  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (limit to 50MB for video)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError(`File size exceeds 50MB. Your file is ${(selectedFile.size/1024/1024).toFixed(2)} MB. Please select a smaller MP4 file.`);
        return;
      }
      
      // Check if file is an MP4
      if (selectedFile.type !== 'video/mp4') {
        setError(`Please select an MP4 video file. Current file type: ${selectedFile.type}`);
        return;
      }
      
      // Success feedback
      setSuccess(`MP4 video "${selectedFile.name}" selected (${(selectedFile.size/1024/1024).toFixed(2)} MB). Click "Update Post" to upload.`);
      setTimeout(() => setSuccess(''), 5000);
      
      setNewVideo(selectedFile);
      setUploadMethod('file');
      // Clear YouTube URL if video file is selected
      handleChange({ target: { name: 'youtubeUrl', value: '' } });
      
      // Create a preview URL for the selected video
      try {
        const videoPreviewUrl = URL.createObjectURL(selectedFile);
        setFormData(prev => ({
          ...prev,
          videoPreviewUrl: videoPreviewUrl
        }));
        console.log('Created video preview URL:', videoPreviewUrl);
      } catch (err) {
        console.error('Error creating video preview URL:', err);
      }
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
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setSaving(false);
        return;
      }
      
      console.log('Submitting with form data:', formData);
      
      // Check if we have a new video file
      const hasNewVideoFile = isVideoContent && uploadMethod === 'file' && newVideo;
      
      if (hasNewVideoFile) {
        // Use FormData for file uploads
        const formDataToSend = new FormData();
        
        // Add basic fields
        formDataToSend.append('id', postId);
        formDataToSend.append('title', formData.title.trim());
        formDataToSend.append('category', formData.category.trim());
        formDataToSend.append('state', formData.state.toLowerCase().trim());
        formDataToSend.append('district', formData.district.toLowerCase().trim());
        formDataToSend.append('content', formData.content);
        formDataToSend.append('contentType', formData.type);
        formDataToSend.append('status', 'approved');
        
        // Include featured image path
        if (formData.featuredImage) {
          formDataToSend.append('featuredImage', formData.featuredImage);
        }
        
        // For video content
        if (isVideoContent) {
          if (uploadMethod === 'youtube') {
            formDataToSend.append('youtubeUrl', formData.youtubeUrl || '');
            console.log('YouTube URL will be updated:', formData.youtubeUrl);
          } else {
            if (newVideo) {
              formDataToSend.append('video', newVideo);
              console.log('New video file will be uploaded:', newVideo.name);
            } else if (formData.videoPath) {
              formDataToSend.append('videoPath', formData.videoPath || '');
              console.log('Preserving existing video:', formData.videoPath);
            }
          }
        } else if (newImage) {
          console.log('Adding new image:', newImage.name);
          formDataToSend.append('featuredImage', newImage);
        }
        
        console.log(`Updating post with ID: ${postId} using re-edit endpoint`);
        
        let uploadStartTime = Date.now();
        let lastProgressUpdate = 0;
        
        const response = await axios({
          method: 'PUT',
          url: `${API_BASE_URL}/api/news/re-edit/${postId}`,
          data: formDataToSend,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const currentTime = Date.now();
              if (currentTime - lastProgressUpdate > 100) {
                const percentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentComplete);
                console.log(`Upload progress: ${percentComplete}%`);
                lastProgressUpdate = currentTime;
              }
            }
          }
        });
        
        console.log('Update response:', response.data);
      } else {
        // Use JSON payload for regular updates
        // Prepare the update payload
        const updatedData = {
          id: postId,
          title: formData.title.trim(),
          content: formData.content,
          category: formData.category.trim(),
          state: formData.state.toLowerCase().trim(),
          district: formData.district.toLowerCase().trim(),
          featuredImage: formData.featuredImage || '',
          contentType: isVideoContent ? 'video' : 'standard',
          status: 'approved'
        };
        
        // Handle video content
        if (isVideoContent) {
          if (uploadMethod === 'youtube') {
            updatedData.youtubeUrl = formData.youtubeUrl || '';
            console.log('YouTube URL will be updated:', formData.youtubeUrl);
          } else {
            updatedData.videoPath = formData.videoPath || '';
            updatedData.video = formData.videoPath || '';
            console.log('Preserving existing video:', formData.videoPath);
          }
        }
        
        console.log(`Updating post with ID: ${postId} using re-edit endpoint`);
        
        const response = await axios({
          method: 'PUT',
          url: `${API_BASE_URL}/api/news/re-edit/${postId}`,
          data: updatedData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        console.log('Update response:', response.data);
      }
      
      setSuccess('Post updated successfully!');
      setTimeout(() => {
        navigate('/posts');
      }, 2000);
    } catch (err) {
      console.error('Error updating post:', err);
      
      if (err.response) {
        console.log('Error response:', err.response.status, err.response.data);
        setError(`API Error (${err.response.status}): ${err.response.data.message || 'Failed to update post'}`);
      } else if (err.request) {
        setError('No response received from server. Please check your connection.');
      } else {
        setError(err.message || 'Unknown error occurred');
      }
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };
  
  const handleCancel = () => {
    navigate('/posts');
  };
  
  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return url;
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
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
            Edit {formData.category.toLowerCase() === 'entertainment' ? 'Entertainment Post' : (isVideoContent ? 'Video Post' : 'Standard Post')} {postId && `(ID: ${postId})`}
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
        
        {/* Upload progress indicator */}
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
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2, fontFamily: 'Poppins' }}>Loading post data...</Typography>
          </Box>
        ) : (
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
                {isVideoContent ? 'Video Title' : 'Headline'}
              </Typography>
              <TextField
                fullWidth
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                  },
                }}
              />
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 3 }}>
              <FormControl fullWidth>
                <StyledInputLabel>Category</StyledInputLabel>
                <StyledSelect
                  name="category"
                  value={formData.category || ''}
                  onChange={(e) => {
                    const newCategory = e.target.value;
                    console.log('User selected category:', newCategory);
                    handleChange(e);
                    
                    // Auto-set to standard post if Entertainment
                    if (newCategory.toLowerCase() === 'entertainment') {
                      setIsVideoContent(false);
                      setFormData(prev => ({ ...prev, type: 'standard' }));
                    }
                  }}
                  label="Category"
                  required
                >
                  <MenuItem value="national">राष्ट्रीय | National</MenuItem>
                  <MenuItem value="international">अंतर्राष्ट्रीय | International</MenuItem>
                  <MenuItem value="sports">खेल | Sports</MenuItem>
                  <MenuItem value="entertainment">मनोरंजन | Entertainment</MenuItem>
                </StyledSelect>
              </FormControl>
              
              <FormControl fullWidth>
                <StyledInputLabel>State</StyledInputLabel>
                <StyledSelect
                  name="state"
                  value={formData.state || ''}
                  onChange={(e) => {
                    const newState = e.target.value;
                    console.log('User selected state:', newState);
                    handleChange(e);
                    // When state changes, reset district
                    setFormData(prev => ({
                      ...prev,
                      district: ''
                    }));
                  }}
                  label="State"
                  required
                >
                  {STATES.map(state => (
                    <MenuItem key={state.value} value={state.value}>{state.label}</MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
              
              <FormControl fullWidth>
                <StyledInputLabel>District</StyledInputLabel>
                <StyledSelect
                  name="district"
                  value={formData.district || ''}
                  onChange={(e) => {
                    const newDistrict = e.target.value;
                    console.log('User selected district:', newDistrict);
                    handleChange(e);
                  }}
                  label="District"
                  disabled={!formData.state}
                  required
                >
                  {formData.state && DISTRICTS[formData.state] ? 
                    DISTRICTS[formData.state].map(district => (
                      <MenuItem key={district.value} value={district.value}>{district.label}</MenuItem>
                    )) : 
                    <MenuItem value="" disabled>Select state first</MenuItem>
                  }
                </StyledSelect>
              </FormControl>
            </Box>
            
            {/* Post Type Selector - hide completely for Entertainment category */}
            {formData.category.toLowerCase() !== 'entertainment' && (
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
                    variant={isVideoContent ? 'outlined' : 'contained'}
                    onClick={() => {
                      setIsVideoContent(false);
                      setFormData(prev => ({ ...prev, type: 'standard' }));
                    }}
                    sx={{
                      textTransform: 'none',
                      fontFamily: 'Poppins',
                    }}
                  >
                    Standard
                  </Button>
                  <Button
                    variant={isVideoContent ? 'contained' : 'outlined'}
                    onClick={() => {
                      setIsVideoContent(true);
                      setFormData(prev => ({ ...prev, type: 'video' }));
                    }}
                    sx={{
                      textTransform: 'none',
                      fontFamily: 'Poppins',
                    }}
                  >
                    Video
                  </Button>
                </Box>
              </Box>
            )}
            
            {/* If Entertainment or not video, show featured image */}
            {(formData.category.toLowerCase() === 'entertainment' || !isVideoContent) && (
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
                  <UploadButton 
                    component="label"
                    disabled={post && post.featuredImage}
                  >
                    {post && post.featuredImage ? 'Featured Image Cannot Be Changed' : 'Change Image'}
                    <input 
                      type="file" 
                      hidden 
                      accept="image/*" 
                      onChange={handleImageChange}
                      disabled={post && post.featuredImage}
                    />
                  </UploadButton>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#666',
                      fontFamily: 'Poppins',
                      mt: 1,
                    }}
                  >
                    {post && post.featuredImage ? 'Original image will be preserved' : newImage ? newImage.name : 'No new image selected'}
                  </Typography>
                </Box>
              </Box>
            )}
            
            {/* Only show video content options if NOT Entertainment category */}
            {formData.category.toLowerCase() !== 'entertainment' && isVideoContent && (
              <>
                {/* Video Source Selection */}
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
                      onClick={() => {
                        setUploadMethod('youtube');
                        setNewVideo(null);
                      }}
                      sx={{
                        textTransform: 'none',
                        fontFamily: 'Poppins',
                      }}
                    >
                      {post && post.youtubeUrl ? 'Current: YouTube URL' : 'YouTube URL'}
                    </Button>
                    <Button
                      variant={uploadMethod === 'file' ? 'contained' : 'outlined'}
                      onClick={() => {
                        setUploadMethod('file');
                        handleChange({ target: { name: 'youtubeUrl', value: '' } });
                      }}
                      sx={{
                        textTransform: 'none',
                        fontFamily: 'Poppins',
                      }}
                    >
                      {formData.videoPath ? 'Current: MP4 File' : 'Upload MP4 File'}
                    </Button>
                  </Box>
                </Box>
                
                {uploadMethod === 'youtube' && (
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
                      name="youtubeUrl"
                      value={formData.youtubeUrl}
                      onChange={handleChange}
                      placeholder="https://www.youtube.com/watch?v=abc123"
                      disabled={post && post.youtubeUrl}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontFamily: 'Poppins',
                          fontSize: '14px',
                        },
                      }}
                    />
                    {post && post.youtubeUrl && (
                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: '#666',
                          fontStyle: 'italic',
                          mt: 0.5,
                          fontFamily: 'Poppins',
                        }}
                      >
                        YouTube URL cannot be changed for existing video posts
                      </Typography>
                    )}
                  </Box>
                )}
                
                {uploadMethod === 'youtube' && formData.youtubeUrl && (
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
                    <Box sx={{ 
                      border: '1px solid rgba(0, 0, 0, 0.12)', 
                      borderRadius: '4px', 
                      p: 2,
                      height: '300px',
                      overflow: 'hidden' 
                    }}>
                      {formData.youtubeUrl && (
                        <iframe
                          width="100%"
                          height="100%"
                          src={getEmbedUrl(formData.youtubeUrl)}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      )}
                    </Box>
                  </Box>
                )}
                
                {uploadMethod === 'file' && (
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
                        p: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <UploadButton 
                        component="label"
                        disabled={post && post.videoPath}
                      >
                        {post && post.videoPath ? 'Video Cannot Be Changed' : 'Upload New Video'}
                        <input 
                          type="file" 
                          hidden 
                          accept="video/mp4" 
                          onChange={handleVideoChange}
                          disabled={post && post.videoPath}
                        />
                      </UploadButton>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#666',
                          fontFamily: 'Poppins',
                        }}
                      >
                        {post && post.videoPath ? 'Original video will be preserved' : newVideo ? newVideo.name : 'No new video selected'}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </>
            )}
            
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: '#666',
                  fontFamily: 'Poppins',
                  mb: 1,
                }}
              >
                {isVideoContent && formData.category.toLowerCase() !== 'entertainment' ? 'Video Description' : 'Content'}
              </Typography>
              <Editor
                apiKey="omxjaluaxpgfpa6xkfadimoprrirfmhozsrtpb3o1uimu4c5"
                onInit={(evt, editor) => {
                  editorRef.current = editor;
                }}
                value={formData.content}
                onEditorChange={handleEditorChange}
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
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleCancel}
                sx={{
                  textTransform: 'none',
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                }}
              >
                Cancel
              </Button>
              <PublishButton
                type="submit"
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} color="inherit" /> : 'Update Post'}
              </PublishButton>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default AdminEditPost; 