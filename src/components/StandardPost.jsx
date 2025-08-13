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
    additionalImages: [null, null, null, null], // 4 additional image slots
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

    // console.log('🔥 PUBLISH STANDARD POST CLICKED');
    // console.log('='.repeat(60));
    // console.log('📝 USER INPUT DATA:');
    // console.log('Title (Headline):', formData.title);
    // console.log('Category:', formData.category);
    // console.log('State:', formData.state);
    // console.log('District:', formData.district);
    // console.log('Content Preview:', formData.content.substring(0, 150) + (formData.content.length > 150 ? '...' : ''));
    // console.log('Content Full Length:', formData.content.length, 'characters');
    
    // if (formData.featuredImage) {
    //   console.log('Featured Image Selected:');
    //   console.log('  - Name:', formData.featuredImage.name);
    //   console.log('  - Size:', (formData.featuredImage.size / 1024 / 1024).toFixed(2), 'MB');
    //   console.log('  - Type:', formData.featuredImage.type);
    // } else {
    //   console.log('Featured Image: None selected');
    // }
    // console.log('='.repeat(60));

    try {
      const token = localStorage.getItem('token');
      // console.log('Token retrieved from localStorage:', token ? 'Token exists' : 'No token found');
      
      if (!token) {
        // console.log('❌ Error: No token found in localStorage');
        throw new Error('Please login again. Your session has expired.');
      }

      // Prepare FormData for API
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('contentType', 'standard'); // Explicitly set contentType as standard
      
      // console.log('📝 Data being sent to API:');
      // console.log('- Title (Headline):', formData.title);
      // console.log('- Category:', formData.category);
      // console.log('- State:', formData.state);
      // console.log('- District:', formData.district);
      // console.log('- Content Type:', 'standard');
      // console.log('- Content length:', formData.content.length, 'characters');
      
      // TEMPORARILY DISABLE IMAGES TO TEST TEXT-ONLY POST CREATION
      console.log('TESTING: Skipping all images to test basic post creation');
      
      // TODO: Re-enable images after confirming text fields work
      // if (formData.featuredImage) {
      //   console.log('Featured image selected but skipped for testing');
      // }
      // 
      // const validAdditionalImages = formData.additionalImages.filter(img => img !== null);
      // if (validAdditionalImages.length > 0) {
      //   console.log(`${validAdditionalImages.length} additional images selected but skipped for testing`);
      // }

      // Validate FormData before sending
      // console.log('🔍 FORMDATA VALIDATION:');
      const formDataEntries = Array.from(formDataToSend.entries());
      // console.log('Total FormData entries:', formDataEntries.length);
      
      // Check if featuredImage is in FormData (disabled for testing)
      const hasImage = false; // formDataEntries.some(([key]) => key === 'featuredImage');
      console.log('Featured Image in FormData: DISABLED FOR TESTING');
      
      // Log FormData contents
      // console.log('🚀 Sending POST request to: https://api.newztok.in/api/news/admin/create');
      // console.log('📦 COMPLETE FormData contents:');
      // for (let [key, value] of formDataToSend.entries()) {
      //   if (key === 'featuredImage') {
      //     console.log(`- ${key}:`, value instanceof File ? 
      //       `✅ File(name: ${value.name}, size: ${value.size} bytes, type: ${value.type})` : 
      //       `❌ Not a file: ${value}`);
      //   } else {
      //     console.log(`- ${key}:`, value);
      //   }
      // }
      
      // Skip image re-adding for testing
      console.log('TESTING: Skipping image re-adding logic');

      // Create axios instance with default config
      const axiosInstance = axios.create({
        baseURL: 'https://api.newztok.in',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          // Let axios set Content-Type automatically for FormData
        },
        maxContentLength: 50 * 1024 * 1024, // 50MB
        maxBodyLength: 50 * 1024 * 1024, // 50MB
      });

      // Final validation before API call
      // console.log('🔄 FINAL PRE-SEND VALIDATION:');
      const finalFormDataEntries = Array.from(formDataToSend.entries());
      const finalHasImage = false; // finalFormDataEntries.some(([key]) => key === 'featuredImage');
      const finalHasContentType = finalFormDataEntries.some(([key]) => key === 'contentType');
      
      // console.log('📊 FINAL SEND SUMMARY:');
      // console.log('- Title:', formDataToSend.get('title'));
      // console.log('- Category:', formDataToSend.get('category'));
      // console.log('- State:', formDataToSend.get('state'));
      // console.log('- District:', formDataToSend.get('district'));
      // console.log('- Content Type:', formDataToSend.get('contentType'));
      // console.log('- Content Length:', formDataToSend.get('content')?.length, 'characters');
      // console.log('- Featured Image Included:', finalHasImage ? '✅ YES' : '❌ NO');
      // console.log('- Content Type Set:', finalHasContentType ? '✅ YES' : '❌ NO');
      
      if (!finalHasContentType) {
        // console.log('⚠️ Adding missing contentType...');
        formDataToSend.append('contentType', 'standard');
      }

      // Show exactly what data is being posted
      // console.log('🚀 POSTING DATA TO API - START');
      // console.log('='.repeat(50));
      // console.log('📤 DATA BEING POSTED:');
      // console.log('URL:', 'https://api.newztok.in/api/news/admin/create');
      // console.log('Method:', 'POST');
      // console.log('Headers:', {
      //   'Authorization': `Bearer ${token.substring(0, 20)}...`,
      //   'Accept': 'application/json',
      //   'Content-Type': 'multipart/form-data'
      // });
      
      // console.log('📝 FORM DATA BEING SENT:');
      // console.log('{');
      // for (let [key, value] of formDataToSend.entries()) {
      //   if (key === 'featuredImage' && value instanceof File) {
      //     console.log(`  "${key}": File {`);
      //     console.log(`    name: "${value.name}",`);
      //     console.log(`    size: ${value.size} bytes,`);
      //     console.log(`    type: "${value.type}"`);
      //     console.log(`  },`);
      //   } else {
      //     console.log(`  "${key}": "${value}",`);
      //   }
      // }
      // console.log('}');
      // console.log('='.repeat(50));

      // Log final FormData contents for debugging
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

      console.log('Making API request to /api/news/admin/create...');
      const response = await axiosInstance.post('/api/news/admin/create', formDataToSend);

      // console.log('📥 API RESPONSE RECEIVED - START');
      // console.log('='.repeat(50));
      // console.log('✅ RESPONSE STATUS:', response.status);
      // console.log('📄 POSTED DATA RECEIVED FROM SERVER:');
      // console.log(JSON.stringify(response.data, null, 2));
      // console.log('='.repeat(50));

      if (response.status === 200 || response.status === 201) {
        // console.log('🎉 Post created successfully!');
        
        // Log the complete posted data
        if (response.data && response.data.data) {
          const postData = response.data.data;
          
          // console.log('📄 COMPLETE POSTED DATA:');
          // console.log('Raw data object:', postData);
          // console.log('All object keys:', Object.keys(postData));
          // console.log('JSON representation:', JSON.stringify(postData, null, 2));
          
          // console.log('📄 POSTED DATA DETAILS:');
          // console.log('- Post ID:', postData.id || 'Not provided');
          // console.log('- Title (Headline):', postData.title || 'Not provided');
          // console.log('- Content:', postData.content || 'Not provided');
          // console.log('- Category:', postData.category || 'Not provided');
          // console.log('- State:', postData.state || 'Not provided');
          // console.log('- District:', postData.district || 'Not provided');
          // console.log('- Status:', postData.status || 'Not provided');
          // console.log('- Content Type:', postData.contentType || 'Not provided');
          // console.log('- Admin ID:', postData.adminId || 'Not provided');
          // console.log('- Journalist ID:', postData.journalistId || 'Not provided');
          // console.log('- Views:', postData.views || 'Not provided');
          // console.log('- Is Featured:', postData.isFeatured || 'Not provided');
          // console.log('- Created At:', postData.createdAt || 'Not provided');
          // console.log('- Updated At:', postData.updatedAt || 'Not provided');
          
          // console.log('🖼️ IMAGE FIELDS CHECK:');
          // console.log('- featuredImage exists?', 'featuredImage' in postData);
          // console.log('- featuredImage value:', postData.featuredImage);
          // console.log('- featuredImage type:', typeof postData.featuredImage);
          // console.log('- thumbnailUrl exists?', 'thumbnailUrl' in postData);
          // console.log('- thumbnailUrl value:', postData.thumbnailUrl);
          // console.log('- thumbnailUrl type:', typeof postData.thumbnailUrl);
          
          // if (postData.featuredImage || postData.thumbnailUrl) {
          //   console.log('✅ Featured image data found!');
          //   if (postData.featuredImage) {
          //     console.log('- Featured Image Path:', postData.featuredImage);
          //     console.log('- Full Featured Image URL:', `https://api.newztok.in${postData.featuredImage}`);
          //   }
          //   if (postData.thumbnailUrl) {
          //     console.log('- Thumbnail URL:', postData.thumbnailUrl);
          //     console.log('- Full Thumbnail URL:', `https://api.newztok.in${postData.thumbnailUrl}`);
          //   }
          // } else {
          //   console.log('❌ No featured image data found in response');
          //   console.log('This could mean:');
          //   console.log('1. Image was not uploaded properly');
          //   console.log('2. Server processed the request but image upload failed');
          //   console.log('3. API response structure is different than expected');
          // }
          
          // console.log('📊 POSTED DATA SUMMARY:');
          // console.log('='.repeat(40));
          // console.log('🆔 Post ID:', postData.id);
          // console.log('📰 Title:', postData.title);
          // console.log('📂 Category:', postData.category);
          // console.log('🌍 State:', postData.state);
          // console.log('🏙️ District:', postData.district);
          // console.log('📝 Status:', postData.status);
          // console.log('🔤 Content Type:', postData.contentType);
          // console.log('👤 Admin ID:', postData.adminId);
          // console.log('📊 Views:', postData.views);
          // console.log('⭐ Is Featured:', postData.isFeatured);
          
          // if (postData.featuredImage) {
          //   console.log('🖼️ Featured Image:', postData.featuredImage);
          //   console.log('🔗 Full Image URL:', `https://api.newztok.in${postData.featuredImage}`);
          // } else {
          //   console.log('📷 Featured Image: Not uploaded');
          // }
          
          // if (postData.thumbnailUrl) {
          //   console.log('🖼️ Thumbnail:', postData.thumbnailUrl);
          // }
          
          // console.log('📅 Created:', postData.createdAt);
          // console.log('🔄 Updated:', postData.updatedAt);
          // console.log('='.repeat(40));
        } else {
          // console.log('❌ No data object found in response');
          // console.log('Response structure:', response.data);
        }
        
        setSuccess('Standard Post created and published successfully!');
        
        // Reset form
        // console.log('🔄 Resetting form...');
        setFormData({
          title: '',
          category: '',
          featuredImage: null,
          additionalImages: [null, null, null, null], // Reset additional images
          state: '',
          district: '',
          content: '',
        });
        
        // Clear all file inputs
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
          input.value = '';
        });
        // console.log('✅ File inputs cleared');
        
        // Clear TinyMCE editor
        if (editorRef.current) {
          editorRef.current.setContent('');
          // console.log('✅ TinyMCE editor cleared');
        }
        
        // console.log('✅ Form reset completed');
      }
    } catch (err) {
      console.error('Error occurred during post creation:', {
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
      } else if (err.response?.status === 413) {
        // console.log('❌ File too large error');
        setError('The file you are trying to upload is too large. Please upload a file smaller than 5MB.');
      } else if (err.response?.status === 403) {
        // console.log('❌ Access denied error:', err.response.data);
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
        // console.log('❌ Authentication error: Session expired');
        setError('Your session has expired. Please login again.');
      } else if (err.response?.data?.message) {
        // console.log('❌ API error message:', err.response.data.message);
        setError(err.response.data.message);
      } else if (err.message) {
        // console.log('❌ General error:', err.message);
        setError(err.message);
      } else {
        // console.log('❌ Unknown error occurred');
        setError('Failed to create post. Please try again.');
      }
    } finally {
      setLoading(false);
      // console.log('🏁 PUBLISH PROCESS COMPLETED');
      // console.log('='.repeat(60));
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