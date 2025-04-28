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
} from '@mui/material';
import { VideoLibrary as VideoIcon } from '@mui/icons-material';
import { Editor } from '@tinymce/tinymce-react';

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
  const [selectedState, setSelectedState] = useState('bihar');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const handleStateChange = (event) => {
    const newState = event.target.value;
    setSelectedState(newState);
    setSelectedDistrict(''); // Reset district when state changes
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <VideoIcon sx={{ fontSize: 24 }} />
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
            defaultValue={post?.headline}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Poppins',
                fontSize: '14px',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl fullWidth>
            <StyledInputLabel>Category</StyledInputLabel>
            <StyledSelect
              defaultValue="entertainment"
              label="Category"
            >
              <MenuItem value="entertainment">मनोरंजन | Entertainment</MenuItem>
              <MenuItem value="national">राष्ट्रीय | National</MenuItem>
              <MenuItem value="international">अंतर्राष्ट्रीय | International</MenuItem>
              <MenuItem value="trending">ट्रेंडिंग | Trending</MenuItem>
            </StyledSelect>
          </FormControl>

          <FormControl fullWidth>
            <StyledInputLabel>State</StyledInputLabel>
            <StyledSelect
              value={selectedState}
              onChange={handleStateChange}
              label="State"
            >
              <MenuItem value="bihar">बिहार | Bihar</MenuItem>
              <MenuItem value="uttar pradesh">उत्तर प्रदेश | Uttar Pradesh</MenuItem>
              <MenuItem value="jharkhand">झारखंड | Jharkhand</MenuItem>
            </StyledSelect>
          </FormControl>

          <FormControl fullWidth>
            <StyledInputLabel>District</StyledInputLabel>
            <StyledSelect
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              label="District"
            >
              {selectedState === 'bihar' && DISTRICTS.bihar.map(district => (
                <MenuItem key={district.value} value={district.value}>{district.label}</MenuItem>
              ))}
              {selectedState === 'jharkhand' && DISTRICTS.jharkhand.map(district => (
                <MenuItem key={district.value} value={district.value}>{district.label}</MenuItem>
              ))}
              {selectedState === 'uttar pradesh' && DISTRICTS['uttar pradesh'].map(district => (
                <MenuItem key={district.value} value={district.value}>{district.label}</MenuItem>
              ))}
            </StyledSelect>
          </FormControl>
        </Box>

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
          <br />
          Avoid using shortened links like youtu.be
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#666',
                fontFamily: 'Poppins',
                mb: 1,
              }}
            >
              Upload Video File
            </Typography>
            <UploadButton variant="contained" component="label">
              Choose File
              <input type="file" hidden accept="video/*" />
            </UploadButton>
          </Box>

          <Box sx={{ flex: 1 }}>
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
              placeholder="https://www.youtube.com/watch?v=L3KKlanYMu4"
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
            }}
          >
            Video Preview
          </Typography>
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
        </Box>

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
            apiKey="vbil1yv26sci3hwbqs4ctc1ahy85mj03vnl4etxiinf9sk0h"
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={post?.description}
            init={{
              height: 400,
              menubar: false,
              plugins: 'lists link image preview code fullscreen table wordcount',
              toolbar: 'undo redo | styles | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code fullscreen',
              content_style: 'body { font-family: Poppins, sans-serif; font-size: 14px; }',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <PublishButton variant="contained" onClick={onPublish}>
            Publish
          </PublishButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditPost; 