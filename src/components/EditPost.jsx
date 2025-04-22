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
    { value: 'west-singhbhum', label: 'पश्चिमी सिंहभूम | West Singhbhum' }
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
    { value: 'madhepura', label: 'मधेपुरा | Madhepura' }
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
    { value: 'lalitpur', label: 'ललितपुर | Lalitpur' }
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
              {selectedState === 'bihar' && [
                <MenuItem value="patna">पटना | Patna</MenuItem>,
                <MenuItem value="gaya">गया | Gaya</MenuItem>,
                <MenuItem value="munger">मुंगेर | Munger</MenuItem>,
                <MenuItem value="bhagalpur">भागलपुर | Bhagalpur</MenuItem>,
                <MenuItem value="purnia">पूर्णिया | Purnia</MenuItem>,
                <MenuItem value="darbhanga">दरभंगा | Darbhanga</MenuItem>,
                <MenuItem value="muzaffarpur">मुजफ्फरपुर | Muzaffarpur</MenuItem>,
                <MenuItem value="saharsa">सहरसा | Saharsa</MenuItem>,
                <MenuItem value="sitamarhi">सीतामढ़ी | Sitamarhi</MenuItem>,
                <MenuItem value="vaishali">वैशाली | Vaishali</MenuItem>,
                <MenuItem value="siwan">सिवान | Siwan</MenuItem>,
                <MenuItem value="saran">सारण | Saran</MenuItem>,
                <MenuItem value="gopalganj">गोपालगंज | Gopalganj</MenuItem>,
                <MenuItem value="begusarai">बेगूसराय | Begusarai</MenuItem>,
                <MenuItem value="samastipur">समस्तीपुर | Samastipur</MenuItem>,
                <MenuItem value="madhubani">मधुबनी | Madhubani</MenuItem>,
                <MenuItem value="supaul">सुपौल | Supaul</MenuItem>,
                <MenuItem value="araria">अररिया | Araria</MenuItem>,
                <MenuItem value="kishanganj">किशनगंज | Kishanganj</MenuItem>,
                <MenuItem value="katihar">कटिहार | Katihar</MenuItem>,
                <MenuItem value="east-champaran">पूर्वी चंपारण | East Champaran</MenuItem>,
                <MenuItem value="west-champaran">पश्चिमी चंपारण | West Champaran</MenuItem>,
                <MenuItem value="sheohar">शिवहर | Sheohar</MenuItem>,
                <MenuItem value="madhepura">मधेपुरा | Madhepura</MenuItem>
              ]}
              {selectedState === 'jharkhand' && [
                <MenuItem value="ranchi">रांची | Ranchi</MenuItem>,
                <MenuItem value="jamshedpur">जमशेदपुर | Jamshedpur</MenuItem>,
                <MenuItem value="dhanbad">धनबाद | Dhanbad</MenuItem>,
                <MenuItem value="bokaro">बोकारो | Bokaro</MenuItem>,
                <MenuItem value="deoghar">देवघर | Deoghar</MenuItem>,
                <MenuItem value="hazaribagh">हजारीबाग | Hazaribagh</MenuItem>,
                <MenuItem value="giridih">गिरिडीह | Giridih</MenuItem>,
                <MenuItem value="koderma">कोडरमा | Koderma</MenuItem>,
                <MenuItem value="chatra">चतरा | Chatra</MenuItem>,
                <MenuItem value="gumla">गुमला | Gumla</MenuItem>,
                <MenuItem value="latehar">लातेहार | Latehar</MenuItem>,
                <MenuItem value="lohardaga">लोहरदगा | Lohardaga</MenuItem>,
                <MenuItem value="pakur">पाकुड़ | Pakur</MenuItem>,
                <MenuItem value="palamu">पलामू | Palamu</MenuItem>,
                <MenuItem value="ramgarh">रामगढ़ | Ramgarh</MenuItem>,
                <MenuItem value="sahibganj">साहिबगंज | Sahibganj</MenuItem>,
                <MenuItem value="simdega">सिमडेगा | Simdega</MenuItem>,
                <MenuItem value="singhbhum">सिंहभूम | Singhbhum</MenuItem>,
                <MenuItem value="seraikela-kharsawan">सरायकेला खरसावां | Seraikela Kharsawan</MenuItem>,
                <MenuItem value="east-singhbhum">पूर्वी सिंहभूम | East Singhbhum</MenuItem>,
                <MenuItem value="west-singhbhum">पश्चिमी सिंहभूम | West Singhbhum</MenuItem>
              ]}
              {selectedState === 'uttar pradesh' && [
                <MenuItem value="lucknow">लखनऊ | Lucknow</MenuItem>,
                <MenuItem value="kanpur">कानपुर | Kanpur</MenuItem>,
                <MenuItem value="agra">आगरा | Agra</MenuItem>,
                <MenuItem value="varanasi">वाराणसी | Varanasi</MenuItem>,
                <MenuItem value="prayagraj">प्रयागराज | Prayagraj</MenuItem>,
                <MenuItem value="meerut">मेरठ | Meerut</MenuItem>,
                <MenuItem value="noida">नोएडा | Noida</MenuItem>,
                <MenuItem value="ghaziabad">गाजियाबाद | Ghaziabad</MenuItem>,
                <MenuItem value="bareilly">बरेली | Bareilly</MenuItem>,
                <MenuItem value="aligarh">अलीगढ़ | Aligarh</MenuItem>,
                <MenuItem value="moradabad">मुरादाबाद | Moradabad</MenuItem>,
                <MenuItem value="saharanpur">सहारनपुर | Saharanpur</MenuItem>,
                <MenuItem value="gorakhpur">गोरखपुर | Gorakhpur</MenuItem>,
                <MenuItem value="faizabad">फैजाबाद | Faizabad</MenuItem>,
                <MenuItem value="jaunpur">जौनपुर | Jaunpur</MenuItem>,
                <MenuItem value="mathura">मथुरा | Mathura</MenuItem>,
                <MenuItem value="ballia">बलिया | Ballia</MenuItem>,
                <MenuItem value="rae-bareli">रायबरेली | Rae Bareli</MenuItem>,
                <MenuItem value="sultanpur">सुल्तानपुर | Sultanpur</MenuItem>,
                <MenuItem value="fatehpur">फतेहपुर | Fatehpur</MenuItem>,
                <MenuItem value="pratapgarh">प्रतापगढ़ | Pratapgarh</MenuItem>,
                <MenuItem value="kaushambi">कौशाम्बी | Kaushambi</MenuItem>,
                <MenuItem value="jhansi">झांसी | Jhansi</MenuItem>,
                <MenuItem value="lalitpur">ललितपुर | Lalitpur</MenuItem>
              ]}
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