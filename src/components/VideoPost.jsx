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
import { VideoCall as VideoCallIcon } from '@mui/icons-material';

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
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');

  const handleStateChange = (event) => {
    setState(event.target.value);
    setDistrict('');
  };

  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
  };

  const handleYoutubeLinkChange = (event) => {
    setYoutubeLink(event.target.value);
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
            placeholder="Write a great headline..."
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Poppins',
                fontSize: '14px',
              },
            }}
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
            <StyledSelect>
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
            <StyledSelect value={state} onChange={handleStateChange}>
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
            <StyledSelect value={district} onChange={handleDistrictChange}>
              <option value="">---------</option>
              {state === 'bihar' && (
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
              {state === 'jharkhand' && (
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
              {state === 'up' && (
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
          Upload a video file or paste a YouTube link like: https://www.youtube.com/watch?v=abc123
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
              Upload Video File
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
                <input type="file" hidden accept="video/*" />
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
              value={youtubeLink}
              onChange={handleYoutubeLinkChange}
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
          <VideoPreviewBox>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#FF3B30',
                fontFamily: 'Poppins',
              }}
            >
              No video selected
            </Typography>
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
            apiKey="vbil1yv26sci3hwbqs4ctc1ahy85mj03vnl4etxiinf9sk0h"
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

        <PublishButton>
          🚀 Publish Video Post
        </PublishButton>
      </Paper>
    </Box>
  );
};

export default VideoPost; 