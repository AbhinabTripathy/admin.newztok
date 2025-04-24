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
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import axios from 'axios';

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
  const [activeTab, setActiveTab] = useState(0);
  const [editorData, setEditorData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'editor',
  });
  
  const [journalistData, setJournalistData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'journalist',
    assignedState: '',
    assignedDistrict: '',
    profilePicture: null,
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setSuccess('');
  };

  const handleEditorChange = (event) => {
    const { name, value } = event.target;
    setEditorData({
      ...editorData,
      [name]: value
    });
  };

  const handleJournalistChange = (event) => {
    const { name, value } = event.target;
    setJournalistData(prevData => {
      const newData = { ...prevData };
      
      if (name === 'assignedState') {
        // When state changes, reset district
        newData.assignedState = value;
        newData.assignedDistrict = '';
      } else {
        // For all other fields including district
        newData[name] = value;
      }
      
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
      setJournalistData({
        ...journalistData,
        profilePicture: file
      });
      setError('');
    }
  };

  const validateEditorData = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editorData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(editorData.phoneNumber)) {
      setError('Phone number must be 10 digits without spaces or special characters');
      return false;
    }

    // Password validation
    if (editorData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const validateJournalistData = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(journalistData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(journalistData.phoneNumber)) {
      setError('Phone number must be 10 digits without spaces or special characters');
      return false;
    }

    // Password validation
    if (journalistData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Password match validation
    if (journalistData.password !== journalistData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // State and district validation
    if (!journalistData.assignedState || !journalistData.assignedDistrict) {
      setError('State and district are required');
      return false;
    }

    return true;
  };

  const handleEditorSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!validateEditorData()) {
      setLoading(false);
      return;
    }

    try {
      // Get the authentication token
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      // Clean phone number
      const cleanPhoneNumber = editorData.phoneNumber.replace(/\D/g, '');

      // Create request data with correct field names
      const requestData = {
        username: editorData.username.trim(),
        email: editorData.email.trim().toLowerCase(),
        mobile: cleanPhoneNumber, // Changed from "phone" to "mobile" as required
        password: editorData.password
      };
      
      console.log('Creating editor with data:', {
        username: requestData.username,
        email: requestData.email,
        mobile: requestData.mobile, // Updated log to show "mobile" instead of "phone"
        password: '******'
      });

      // Submit the request
      const response = await submitUserData('/api/auth/create-editor', requestData, token);
      
      if (response.success) {
        setSuccess('Editor created successfully!');
        // Reset form
        setEditorData({
          username: '',
          email: '',
          phoneNumber: '',
          password: '',
          role: 'editor',
        });
      } else {
        setError(response.message || 'Failed to create editor');
      }
    } catch (err) {
      handleSubmitError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJournalistSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!validateJournalistData()) {
      setLoading(false);
      return;
    }

    try {
      // Get the authentication token
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      // Clean phone number
      const cleanPhoneNumber = journalistData.phoneNumber.replace(/\D/g, '');

      // Create request data
      let formData = new FormData();
      formData.append('username', journalistData.username.trim());
      formData.append('email', journalistData.email.trim().toLowerCase());
      formData.append('mobile', cleanPhoneNumber); // Changed to mobile
      formData.append('password', journalistData.password);
      formData.append('confirmPassword', journalistData.confirmPassword);
      formData.append('assignedState', journalistData.assignedState);
      formData.append('assignedDistrict', journalistData.assignedDistrict);
      
      if (journalistData.profilePicture) {
        formData.append('profilePicture', journalistData.profilePicture);
      }
      
      console.log('Creating journalist with data:', {
        username: journalistData.username,
        email: journalistData.email,
        mobile: cleanPhoneNumber, // Changed to mobile
        assignedState: journalistData.assignedState,
        assignedDistrict: journalistData.assignedDistrict,
        hasProfilePicture: !!journalistData.profilePicture
      });

      // Make the API request directly
      const response = await axios({
        method: 'POST',
        url: 'https://api.newztok.in/api/dashboard/journalist/create',
        data: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Journalist creation response:', response.data);
      
      if (response.data.success) {
        setSuccess('Journalist created successfully!');
        // Reset form
        setJournalistData({
          username: '',
          email: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
          role: 'journalist',
          assignedState: '',
          assignedDistrict: '',
          profilePicture: null,
        });
      } else {
        setError(response.data.message || 'Failed to create journalist');
      }
    } catch (err) {
      handleSubmitError(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to submit user data with different content types
  const submitUserData = async (endpoint, data, token) => {
    try {
      // Try with application/json first
      const response = await axios({
        method: 'POST',
        url: `https://api.newztok.in${endpoint}`,
        data: data instanceof FormData ? data : data,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': data instanceof FormData ? undefined : 'application/json'
        }
      });
      
      return { success: true, data: response.data };
    } catch (jsonError) {
      console.log('JSON request failed, trying x-www-form-urlencoded');
      
      // If JSON fails, try with x-www-form-urlencoded
      if (!(data instanceof FormData)) {
        const urlEncodedData = new URLSearchParams();
        Object.keys(data).forEach(key => {
          urlEncodedData.append(key, data[key]);
        });
        
        const response = await axios({
          method: 'POST',
          url: `https://api.newztok.in${endpoint}`,
          data: urlEncodedData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        
        return { success: true, data: response.data };
      } else {
        // Re-throw if FormData
        throw jsonError;
      }
    }
  };

  // Helper function to handle submission errors
  const handleSubmitError = (err) => {
    console.error('Error creating user:', err);
    
    if (err.response) {
      console.log('Error response data:', err.response.data);
      console.log('Error response status:', err.response.status);
      
      // Try to extract the most useful error message
      if (err.response.data) {
        if (err.response.data.error) {
          setError(err.response.data.error);
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.status === 400) {
          setError('Invalid data provided. Please check all fields and try again.');
        } else if (err.response.status === 401) {
          setError('Authentication failed. Please login again.');
        } else if (err.response.status === 403) {
          setError('You do not have permission to create users.');
        } else if (err.response.status === 500) {
          setError('Server error occurred. Please try again later.');
        } else {
          setError(`Error: ${err.response.status}`);
        }
      } else {
        setError(`Error: ${err.response.status}`);
      }
    } else if (err.message) {
      setError(err.message);
    } else {
      setError('Failed to create user. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/manage-users');
  };

  const renderEditorForm = () => (
    <Box component="form" onSubmit={handleEditorSubmit}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
        <StyledTextField
          label="Username"
          name="username"
          value={editorData.username}
          onChange={handleEditorChange}
          fullWidth
          required
        />
        <StyledTextField
          label="Email"
          name="email"
          type="email"
          value={editorData.email}
          onChange={handleEditorChange}
          fullWidth
          required
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
        <StyledTextField
          label="Phone Number"
          name="phoneNumber"
          value={editorData.phoneNumber}
          onChange={handleEditorChange}
          fullWidth
          required
          helperText="10 digits without spaces"
        />
        <StyledTextField
          label="Password"
          name="password"
          type="password"
          value={editorData.password}
          onChange={handleEditorChange}
          fullWidth
          required
          helperText="Minimum 6 characters"
        />
      </Box>

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
          disabled={loading}
          sx={{
            backgroundColor: '#FF3B30',
            '&:hover': {
              backgroundColor: '#E60000',
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Editor'}
        </StyledButton>
      </Box>
    </Box>
  );

  const renderJournalistForm = () => (
    <Box component="form" onSubmit={handleJournalistSubmit}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
        <StyledTextField
          label="Username"
          name="username"
          value={journalistData.username}
          onChange={handleJournalistChange}
          fullWidth
          required
        />
        <StyledTextField
          label="Email"
          name="email"
          type="email"
          value={journalistData.email}
          onChange={handleJournalistChange}
          fullWidth
          required
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
        <StyledTextField
          label="Phone Number"
          name="phoneNumber"
          value={journalistData.phoneNumber}
          onChange={handleJournalistChange}
          fullWidth
          required
          helperText="10 digits without spaces"
        />
        <StyledTextField
          label="Password"
          name="password"
          type="password"
          value={journalistData.password}
          onChange={handleJournalistChange}
          fullWidth
          required
          helperText="Minimum 6 characters"
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
        <StyledTextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={journalistData.confirmPassword}
          onChange={handleJournalistChange}
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
              {journalistData.profilePicture ? journalistData.profilePicture.name : 'Upload Profile Picture'}
            </UploadButton>
          </label>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="state-label">Assigned State</InputLabel>
          <Select
            labelId="state-label"
            id="state-select"
            label="Assigned State"
            name="assignedState"
            value={journalistData.assignedState}
            onChange={handleJournalistChange}
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
            value={journalistData.assignedDistrict}
            onChange={handleJournalistChange}
            required
            disabled={!journalistData.assignedState}
          >
            <MenuItem value="">---------</MenuItem>
            {journalistData.assignedState === 'bihar' && [
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
            {journalistData.assignedState === 'jharkhand' && [
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
            {journalistData.assignedState === 'up' && [
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
          disabled={loading}
          sx={{
            backgroundColor: '#FF3B30',
            '&:hover': {
              backgroundColor: '#E60000',
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Journalist'}
        </StyledButton>
      </Box>
    </Box>
  );

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

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="user type tabs">
            <Tab label="Create Editor" />
            <Tab label="Create Journalist" />
          </Tabs>
        </Box>

        {activeTab === 0 ? renderEditorForm() : renderJournalistForm()}
      </Paper>
    </Box>
  );
};

export default CreateNewUser; 