import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const EditUser = () => {
  const location = useLocation();
  const user = location.state?.user;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    phone: user?.phone || '',
    email: user?.email || '',
    role: user?.role || 'Editor',
    state: user?.state || 'बिहार | Bihar',
    district: user?.district || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // If state is changed, reset district
      if (name === 'state') {
        return {
          ...prev,
          [name]: value,
          district: ''
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleCancel = () => {
    navigate('/manage-users');
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving user:', formData);
    navigate('/manage-users');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          fontSize: '28px',
          fontWeight: 600,
          color: '#1a1a1a',
          fontFamily: 'Poppins',
          mb: 3,
        }}
      >
        Edit User: {user?.name}
      </Typography>

      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          <Box>
            <Typography
              sx={{
                mb: 1,
                fontSize: '14px',
                fontWeight: 500,
                color: '#1a1a1a',
                fontFamily: 'Poppins',
              }}
            >
              First Name
            </Typography>
            <TextField
              fullWidth
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                },
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                mb: 1,
                fontSize: '14px',
                fontWeight: 500,
                color: '#1a1a1a',
                fontFamily: 'Poppins',
              }}
            >
              Last Name
            </Typography>
            <TextField
              fullWidth
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                },
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                mb: 1,
                fontSize: '14px',
                fontWeight: 500,
                color: '#1a1a1a',
                fontFamily: 'Poppins',
              }}
            >
              Phone Number
            </Typography>
            <TextField
              fullWidth
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                },
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                mb: 1,
                fontSize: '14px',
                fontWeight: 500,
                color: '#1a1a1a',
                fontFamily: 'Poppins',
              }}
            >
              Email
            </Typography>
            <TextField
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                },
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                mb: 1,
                fontSize: '14px',
                fontWeight: 500,
                color: '#1a1a1a',
                fontFamily: 'Poppins',
              }}
            >
              Role
            </Typography>
            <TextField
              select
              fullWidth
              name="role"
              value={formData.role}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                },
              }}
            >
              <MenuItem value="Editor">Editor</MenuItem>
              <MenuItem value="Journalist">Journalist</MenuItem>
            </TextField>
          </Box>

          <Box>
            <Typography
              sx={{
                mb: 1,
                fontSize: '14px',
                fontWeight: 500,
                color: '#1a1a1a',
                fontFamily: 'Poppins',
              }}
            >
              State
            </Typography>
            <TextField
              select
              fullWidth
              name="state"
              value={formData.state}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                },
              }}
            >
              <MenuItem value="बिहार | Bihar">बिहार | Bihar</MenuItem>
              <MenuItem value="झारखंड | Jharkhand">झारखंड | Jharkhand</MenuItem>
              <MenuItem value="उत्तर प्रदेश | Uttar Pradesh">उत्तर प्रदेश | Uttar Pradesh</MenuItem>
            </TextField>
          </Box>

          <Box sx={{ gridColumn: '1 / -1' }}>
            <Typography
              sx={{
                mb: 1,
                fontSize: '14px',
                fontWeight: 500,
                color: '#1a1a1a',
                fontFamily: 'Poppins',
              }}
            >
              District
            </Typography>
            <TextField
              select
              fullWidth
              name="district"
              value={formData.district}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                },
              }}
            >
              <MenuItem value="">Select District</MenuItem>
              {formData.state === 'बिहार | Bihar' && [
                <MenuItem key="patna" value="पटना | Patna">पटना | Patna</MenuItem>,
                <MenuItem key="gaya" value="गया | Gaya">गया | Gaya</MenuItem>,
                <MenuItem key="munger" value="मुंगेर | Munger">मुंगेर | Munger</MenuItem>,
                <MenuItem key="bhagalpur" value="भागलपुर | Bhagalpur">भागलपुर | Bhagalpur</MenuItem>,
                <MenuItem key="purnia" value="पूर्णिया | Purnia">पूर्णिया | Purnia</MenuItem>,
                <MenuItem key="darbhanga" value="दरभंगा | Darbhanga">दरभंगा | Darbhanga</MenuItem>,
                <MenuItem key="muzaffarpur" value="मुजफ्फरपुर | Muzaffarpur">मुजफ्फरपुर | Muzaffarpur</MenuItem>,
                <MenuItem key="saharsa" value="सहरसा | Saharsa">सहरसा | Saharsa</MenuItem>,
                <MenuItem key="sitamarhi" value="सीतामढ़ी | Sitamarhi">सीतामढ़ी | Sitamarhi</MenuItem>,
                <MenuItem key="vaishali" value="वैशाली | Vaishali">वैशाली | Vaishali</MenuItem>,
                <MenuItem key="siwan" value="सिवान | Siwan">सिवान | Siwan</MenuItem>,
                <MenuItem key="saran" value="सारण | Saran">सारण | Saran</MenuItem>,
                <MenuItem key="gopalganj" value="गोपालगंज | Gopalganj">गोपालगंज | Gopalganj</MenuItem>,
                <MenuItem key="begusarai" value="बेगूसराय | Begusarai">बेगूसराय | Begusarai</MenuItem>,
                <MenuItem key="samastipur" value="समस्तीपुर | Samastipur">समस्तीपुर | Samastipur</MenuItem>,
                <MenuItem key="madhubani" value="मधुबनी | Madhubani">मधुबनी | Madhubani</MenuItem>,
                <MenuItem key="supaul" value="सुपौल | Supaul">सुपौल | Supaul</MenuItem>,
                <MenuItem key="araria" value="अररिया | Araria">अररिया | Araria</MenuItem>,
                <MenuItem key="kishanganj" value="किशनगंज | Kishanganj">किशनगंज | Kishanganj</MenuItem>,
                <MenuItem key="katihar" value="कटिहार | Katihar">कटिहार | Katihar</MenuItem>,
                <MenuItem key="east-champaran" value="पूर्वी चंपारण | East Champaran">पूर्वी चंपारण | East Champaran</MenuItem>,
                <MenuItem key="west-champaran" value="पश्चिमी चंपारण | West Champaran">पश्चिमी चंपारण | West Champaran</MenuItem>,
                <MenuItem key="sheohar" value="शिवहर | Sheohar">शिवहर | Sheohar</MenuItem>,
                <MenuItem key="madhepura" value="मधेपुरा | Madhepura">मधेपुरा | Madhepura</MenuItem>
              ]}
              {formData.state === 'झारखंड | Jharkhand' && [
                <MenuItem key="ranchi" value="रांची | Ranchi">रांची | Ranchi</MenuItem>,
                <MenuItem key="jamshedpur" value="जमशेदपुर | Jamshedpur">जमशेदपुर | Jamshedpur</MenuItem>,
                <MenuItem key="dhanbad" value="धनबाद | Dhanbad">धनबाद | Dhanbad</MenuItem>,
                <MenuItem key="bokaro" value="बोकारो | Bokaro">बोकारो | Bokaro</MenuItem>,
                <MenuItem key="deoghar" value="देवघर | Deoghar">देवघर | Deoghar</MenuItem>,
                <MenuItem key="hazaribagh" value="हजारीबाग | Hazaribagh">हजारीबाग | Hazaribagh</MenuItem>,
                <MenuItem key="giridih" value="गिरिडीह | Giridih">गिरिडीह | Giridih</MenuItem>,
                <MenuItem key="koderma" value="कोडरमा | Koderma">कोडरमा | Koderma</MenuItem>,
                <MenuItem key="chatra" value="चतरा | Chatra">चतरा | Chatra</MenuItem>,
                <MenuItem key="gumla" value="गुमला | Gumla">गुमला | Gumla</MenuItem>,
                <MenuItem key="latehar" value="लातेहार | Latehar">लातेहार | Latehar</MenuItem>,
                <MenuItem key="lohardaga" value="लोहरदगा | Lohardaga">लोहरदगा | Lohardaga</MenuItem>,
                <MenuItem key="pakur" value="पाकुड़ | Pakur">पाकुड़ | Pakur</MenuItem>,
                <MenuItem key="palamu" value="पलामू | Palamu">पलामू | Palamu</MenuItem>,
                <MenuItem key="ramgarh" value="रामगढ़ | Ramgarh">रामगढ़ | Ramgarh</MenuItem>,
                <MenuItem key="sahibganj" value="साहिबगंज | Sahibganj">साहिबगंज | Sahibganj</MenuItem>,
                <MenuItem key="simdega" value="सिमडेगा | Simdega">सिमडेगा | Simdega</MenuItem>,
                <MenuItem key="singhbhum" value="सिंहभूम | Singhbhum">सिंहभूम | Singhbhum</MenuItem>,
                <MenuItem key="seraikela" value="सरायकेला खरसावां | Seraikela Kharsawan">सरायकेला खरसावां | Seraikela Kharsawan</MenuItem>,
                <MenuItem key="east-singhbhum" value="पूर्वी सिंहभूम | East Singhbhum">पूर्वी सिंहभूम | East Singhbhum</MenuItem>,
                <MenuItem key="west-singhbhum" value="पश्चिमी सिंहभूम | West Singhbhum">पश्चिमी सिंहभूम | West Singhbhum</MenuItem>
              ]}
              {formData.state === 'उत्तर प्रदेश | Uttar Pradesh' && [
                <MenuItem key="lucknow" value="लखनऊ | Lucknow">लखनऊ | Lucknow</MenuItem>,
                <MenuItem key="kanpur" value="कानपुर | Kanpur">कानपुर | Kanpur</MenuItem>,
                <MenuItem key="agra" value="आगरा | Agra">आगरा | Agra</MenuItem>,
                <MenuItem key="varanasi" value="वाराणसी | Varanasi">वाराणसी | Varanasi</MenuItem>,
                <MenuItem key="prayagraj" value="प्रयागराज | Prayagraj">प्रयागराज | Prayagraj</MenuItem>,
                <MenuItem key="meerut" value="मेरठ | Meerut">मेरठ | Meerut</MenuItem>,
                <MenuItem key="noida" value="नोएडा | Noida">नोएडा | Noida</MenuItem>,
                <MenuItem key="ghaziabad" value="गाजियाबाद | Ghaziabad">गाजियाबाद | Ghaziabad</MenuItem>,
                <MenuItem key="bareilly" value="बरेली | Bareilly">बरेली | Bareilly</MenuItem>,
                <MenuItem key="aligarh" value="अलीगढ़ | Aligarh">अलीगढ़ | Aligarh</MenuItem>,
                <MenuItem key="moradabad" value="मुरादाबाद | Moradabad">मुरादाबाद | Moradabad</MenuItem>,
                <MenuItem key="saharanpur" value="सहारनपुर | Saharanpur">सहारनपुर | Saharanpur</MenuItem>,
                <MenuItem key="gorakhpur" value="गोरखपुर | Gorakhpur">गोरखपुर | Gorakhpur</MenuItem>,
                <MenuItem key="faizabad" value="फैजाबाद | Faizabad">फैजाबाद | Faizabad</MenuItem>,
                <MenuItem key="jaunpur" value="जौनपुर | Jaunpur">जौनपुर | Jaunpur</MenuItem>,
                <MenuItem key="mathura" value="मथुरा | Mathura">मथुरा | Mathura</MenuItem>,
                <MenuItem key="ballia" value="बलिया | Ballia">बलिया | Ballia</MenuItem>,
                <MenuItem key="rae-bareli" value="रायबरेली | Rae Bareli">रायबरेली | Rae Bareli</MenuItem>,
                <MenuItem key="sultanpur" value="सुल्तानपुर | Sultanpur">सुल्तानपुर | Sultanpur</MenuItem>,
                <MenuItem key="fatehpur" value="फतेहपुर | Fatehpur">फतेहपुर | Fatehpur</MenuItem>,
                <MenuItem key="pratapgarh" value="प्रतापगढ़ | Pratapgarh">प्रतापगढ़ | Pratapgarh</MenuItem>,
                <MenuItem key="kaushambi" value="कौशाम्बी | Kaushambi">कौशाम्बी | Kaushambi</MenuItem>,
                <MenuItem key="jhansi" value="झांसी | Jhansi">झांसी | Jhansi</MenuItem>,
                <MenuItem key="lalitpur" value="ललितपुर | Lalitpur">ललितपुर | Lalitpur</MenuItem>
              ]}
            </TextField>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 4,
          }}
        >
          <Button
            onClick={handleCancel}
            sx={{
              color: '#666',
              fontFamily: 'Poppins',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              px: 3,
              py: 1,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: '#2196F3',
              fontFamily: 'Poppins',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              px: 3,
              py: 1,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#1976D2',
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditUser; 