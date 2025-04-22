import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    fontFamily: 'Poppins',
    fontSize: '14px',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.12)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.24)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2196F3',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: 'Poppins',
    fontSize: '14px',
  },
});

const StyledSelect = styled(Select)({
  fontFamily: 'Poppins',
  fontSize: '14px',
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

const UploadButton = styled(Button)({
  textTransform: 'none',
  fontFamily: 'Poppins',
  fontSize: '14px',
  padding: '8px 16px',
  backgroundColor: '#f5f5f5',
  color: '#666',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
});

const StyledButton = styled(Button)({
  textTransform: 'none',
  fontFamily: 'Poppins',
  fontSize: '14px',
  padding: '8px 24px',
  borderRadius: '4px',
});

const CreateNewUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: '',
    assignedState: '',
    assignedDistrict: '',
    profilePicture: null,
  });
  const [error, setError] = useState('');

  // Debug log whenever formData changes
  React.useEffect(() => {
    console.log('Form Data Updated:', formData);
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log('handleChange:', { name, value });

    // Update form data
    setFormData(prevData => {
      const newData = { ...prevData };
      
      if (name === 'assignedState') {
        // When state changes, reset district
        newData.assignedState = value;
        newData.assignedDistrict = '';
      } else {
        // For all other fields including district
        newData[name] = value;
      }
      
      console.log('Updated form data:', newData);
      return newData;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Profile picture must be less than 5MB');
        return;
      }
      setFormData({
        ...formData,
        profilePicture: file
      });
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Here you would make your API call
      console.log('Ready to submit:', {
        ...formData,
        password: '***hidden***',
        confirmPassword: '***hidden***'
      });
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to create user. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/manage-users');
  };

  return (
    <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
      <Typography
        variant="h4"
        sx={{
          fontSize: '28px',
          fontWeight: 600,
          color: '#1a1a1a',
          fontFamily: 'Poppins',
          mb: 4,
          textAlign: 'center',
        }}
      >
        Create New User
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <StyledSelect
                labelId="role-label"
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <MenuItem value="editor">Editor</MenuItem>
                <MenuItem value="journalist">Journalist</MenuItem>
              </StyledSelect>
            </FormControl>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
            <StyledTextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
            />
            <StyledTextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
            <StyledTextField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              fullWidth
              required
            />
            <StyledTextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
            <StyledTextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
            />
            <Box>
              <input
                type="file"
                accept="image/*"
                id="profile-picture"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="profile-picture">
                <UploadButton
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  {formData.profilePicture ? formData.profilePicture.name : 'Upload Profile Picture'}
                </UploadButton>
              </label>
            </Box>
          </Box>

          {formData.role === 'journalist' && (
            <>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="state-label">Assigned State</InputLabel>
                  <Select
                    labelId="state-label"
                    id="state-select"
                    label="Assigned State"
                    name="assignedState"
                    value={formData.assignedState}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="">---------</MenuItem>
                    <MenuItem value="bihar">बिहार | Bihar</MenuItem>
                    <MenuItem value="jharkhand">झारखंड | Jharkhand</MenuItem>
                    <MenuItem value="up">उत्तर प्रदेश | Uttar Pradesh</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="district-label">Assigned District</InputLabel>
                  <Select
                    labelId="district-label"
                    id="district-select"
                    label="Assigned District"
                    name="assignedDistrict"
                    value={formData.assignedDistrict}
                    onChange={handleChange}
                    required
                    disabled={!formData.assignedState}
                  >
                    <MenuItem value="">---------</MenuItem>
                    {formData.assignedState === 'bihar' && [
                      <MenuItem key="patna" value="patna">पटना | Patna</MenuItem>,
                      <MenuItem key="gaya" value="gaya">गया | Gaya</MenuItem>,
                      <MenuItem key="munger" value="munger">मुंगेर | Munger</MenuItem>,
                      <MenuItem key="bhagalpur" value="bhagalpur">भागलपुर | Bhagalpur</MenuItem>,
                      <MenuItem key="purnia" value="purnia">पूर्णिया | Purnia</MenuItem>,
                      <MenuItem key="darbhanga" value="darbhanga">दरभंगा | Darbhanga</MenuItem>,
                      <MenuItem key="muzaffarpur" value="muzaffarpur">मुजफ्फरपुर | Muzaffarpur</MenuItem>,
                      <MenuItem key="saharsa" value="saharsa">सहरसा | Saharsa</MenuItem>,
                      <MenuItem key="sitamarhi" value="sitamarhi">सीतामढ़ी | Sitamarhi</MenuItem>,
                      <MenuItem key="vaishali" value="vaishali">वैशाली | Vaishali</MenuItem>,
                      <MenuItem key="siwan" value="siwan">सिवान | Siwan</MenuItem>,
                      <MenuItem key="saran" value="saran">सारण | Saran</MenuItem>,
                      <MenuItem key="gopalganj" value="gopalganj">गोपालगंज | Gopalganj</MenuItem>,
                      <MenuItem key="begusarai" value="begusarai">बेगूसराय | Begusarai</MenuItem>,
                      <MenuItem key="samastipur" value="samastipur">समस्तीपुर | Samastipur</MenuItem>,
                      <MenuItem key="madhubani" value="madhubani">मधुबनी | Madhubani</MenuItem>,
                      <MenuItem key="supaul" value="supaul">सुपौल | Supaul</MenuItem>,
                      <MenuItem key="araria" value="araria">अररिया | Araria</MenuItem>,
                      <MenuItem key="kishanganj" value="kishanganj">किशनगंज | Kishanganj</MenuItem>,
                      <MenuItem key="katihar" value="katihar">कटिहार | Katihar</MenuItem>,
                      <MenuItem key="east-champaran" value="east-champaran">पूर्वी चंपारण | East Champaran</MenuItem>,
                      <MenuItem key="west-champaran" value="west-champaran">पश्चिमी चंपारण | West Champaran</MenuItem>,
                      <MenuItem key="sheohar" value="sheohar">शिवहर | Sheohar</MenuItem>,
                      <MenuItem key="madhepura" value="madhepura">मधेपुरा | Madhepura</MenuItem>
                    ]}
                    {formData.assignedState === 'jharkhand' && [
                      <MenuItem key="ranchi" value="ranchi">रांची | Ranchi</MenuItem>,
                      <MenuItem key="jamshedpur" value="jamshedpur">जमशेदपुर | Jamshedpur</MenuItem>,
                      <MenuItem key="dhanbad" value="dhanbad">धनबाद | Dhanbad</MenuItem>,
                      <MenuItem key="bokaro" value="bokaro">बोकारो | Bokaro</MenuItem>,
                      <MenuItem key="deoghar" value="deoghar">देवघर | Deoghar</MenuItem>,
                      <MenuItem key="hazaribagh" value="hazaribagh">हजारीबाग | Hazaribagh</MenuItem>,
                      <MenuItem key="giridih" value="giridih">गिरिडीह | Giridih</MenuItem>,
                      <MenuItem key="koderma" value="koderma">कोडरमा | Koderma</MenuItem>,
                      <MenuItem key="chatra" value="chatra">चतरा | Chatra</MenuItem>,
                      <MenuItem key="gumla" value="gumla">गुमला | Gumla</MenuItem>,
                      <MenuItem key="latehar" value="latehar">लातेहार | Latehar</MenuItem>,
                      <MenuItem key="lohardaga" value="lohardaga">लोहरदगा | Lohardaga</MenuItem>,
                      <MenuItem key="pakur" value="pakur">पाकुड़ | Pakur</MenuItem>,
                      <MenuItem key="palamu" value="palamu">पलामू | Palamu</MenuItem>,
                      <MenuItem key="ramgarh" value="ramgarh">रामगढ़ | Ramgarh</MenuItem>,
                      <MenuItem key="sahibganj" value="sahibganj">साहिबगंज | Sahibganj</MenuItem>,
                      <MenuItem key="simdega" value="simdega">सिमडेगा | Simdega</MenuItem>,
                      <MenuItem key="singhbhum" value="singhbhum">सिंहभूम | Singhbhum</MenuItem>,
                      <MenuItem key="seraikela-kharsawan" value="seraikela-kharsawan">सरायकेला खरसावां | Seraikela Kharsawan</MenuItem>,
                      <MenuItem key="east-singhbhum" value="east-singhbhum">पूर्वी सिंहभूम | East Singhbhum</MenuItem>,
                      <MenuItem key="west-singhbhum" value="west-singhbhum">पश्चिमी सिंहभूम | West Singhbhum</MenuItem>
                    ]}
                    {formData.assignedState === 'up' && [
                      <MenuItem key="lucknow" value="lucknow">लखनऊ | Lucknow</MenuItem>,
                      <MenuItem key="kanpur" value="kanpur">कानपुर | Kanpur</MenuItem>,
                      <MenuItem key="agra" value="agra">आगरा | Agra</MenuItem>,
                      <MenuItem key="varanasi" value="varanasi">वाराणसी | Varanasi</MenuItem>,
                      <MenuItem key="prayagraj" value="prayagraj">प्रयागराज | Prayagraj</MenuItem>,
                      <MenuItem key="meerut" value="meerut">मेरठ | Meerut</MenuItem>,
                      <MenuItem key="noida" value="noida">नोएडा | Noida</MenuItem>,
                      <MenuItem key="ghaziabad" value="ghaziabad">गाजियाबाद | Ghaziabad</MenuItem>,
                      <MenuItem key="bareilly" value="bareilly">बरेली | Bareilly</MenuItem>,
                      <MenuItem key="aligarh" value="aligarh">अलीगढ़ | Aligarh</MenuItem>,
                      <MenuItem key="moradabad" value="moradabad">मुरादाबाद | Moradabad</MenuItem>,
                      <MenuItem key="saharanpur" value="saharanpur">सहारनपुर | Saharanpur</MenuItem>,
                      <MenuItem key="gorakhpur" value="gorakhpur">गोरखपुर | Gorakhpur</MenuItem>,
                      <MenuItem key="faizabad" value="faizabad">फैजाबाद | Faizabad</MenuItem>,
                      <MenuItem key="jaunpur" value="jaunpur">जौनपुर | Jaunpur</MenuItem>,
                      <MenuItem key="mathura" value="mathura">मथुरा | Mathura</MenuItem>,
                      <MenuItem key="ballia" value="ballia">बलिया | Ballia</MenuItem>,
                      <MenuItem key="rae-bareli" value="rae-bareli">रायबरेली | Rae Bareli</MenuItem>,
                      <MenuItem key="sultanpur" value="sultanpur">सुल्तानपुर | Sultanpur</MenuItem>,
                      <MenuItem key="fatehpur" value="fatehpur">फतेहपुर | Fatehpur</MenuItem>,
                      <MenuItem key="pratapgarh" value="pratapgarh">प्रतापगढ़ | Pratapgarh</MenuItem>,
                      <MenuItem key="kaushambi" value="kaushambi">कौशाम्बी | Kaushambi</MenuItem>,
                      <MenuItem key="jhansi" value="jhansi">झांसी | Jhansi</MenuItem>,
                      <MenuItem key="lalitpur" value="lalitpur">ललितपुर | Lalitpur</MenuItem>
                    ]}
                  </Select>
                </FormControl>
              </Box>

              {/* Debug display */}
              <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="caption">
                  Current Selection:
                  <br />
                  State: {formData.assignedState || 'None'}
                  <br />
                  District: {formData.assignedDistrict || 'None'}
                </Typography>
              </Box>
            </>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <StyledButton
              variant="outlined"
              onClick={handleCancel}
              sx={{ color: '#666', borderColor: '#666' }}
            >
              Cancel
            </StyledButton>
            <StyledButton
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#FF3B30',
                '&:hover': {
                  backgroundColor: '#E60000',
                },
              }}
            >
              Create User
            </StyledButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateNewUser; 