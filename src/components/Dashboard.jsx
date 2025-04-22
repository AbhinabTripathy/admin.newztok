import React from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Link,
} from '@mui/material';
import {
  GridView as DashboardIcon,
  Description as DocumentIcon,
  Schedule as PendingIcon,
  CheckCircle as ApprovedIcon,
  Edit as EditIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, bgColor }) => (
  <Card
    sx={{
      flex: { xs: '1 1 100%', md: 1 },
      p: 2.5,
      borderRadius: 3,
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s ease',
      background: title === 'Total Posts' 
        ? 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)'
        : title === 'Pending Review'
        ? 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)'
        : 'linear-gradient(135deg, #23D393 0%, #00B871 100%)',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
      },
    }}
  >
    <Box>
      <Typography
        sx={{
          color: '#FFFFFF',
          fontSize: '14px',
          mb: 0.5,
          fontFamily: 'Poppins',
          fontWeight: 400,
          opacity: 0.9,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h3"
        sx={{
          color: '#FFFFFF',
          fontWeight: 600,
          fontSize: '32px',
          fontFamily: 'Poppins',
        }}
      >
        {value}
      </Typography>
    </Box>
    <Box
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'rotate(10deg)',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
      }}
    >
      {React.cloneElement(icon, { sx: { ...icon.props.sx, color: '#FFFFFF', fontSize: 20 } })}
    </Box>
  </Card>
);

const Dashboard = () => {
  const pendingPosts = [
    {
      title: 'Testing from API by sangram',
      category: 'national',
      submitted: 'Apr 15, 2025',
    },
    {
      title: 'Testing from API by rahesh at 8:30',
      category: 'international',
      submitted: 'Apr 15, 2025',
    },
    {
      title: 'Testing news by Manoranjan',
      category: 'national',
      submitted: 'Apr 16, 2025',
    },
    {
      title: 'Video test by Manoranjan',
      category: 'entertainment',
      submitted: 'Apr 16, 2025',
    },
    {
      title: 'नई टोल नीति तैयार, 3 हजार का वार्षिक पास से आम आदमी को राहत मिलने के आसार',
      category: 'national',
      submitted: 'Apr 13, 2025',
    },
  ];

  return (
    <Box 
      sx={{ 
        p: 3,
        pt: 2,
        mt: '64px',
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        backgroundColor: '#F8F9FA',
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <DashboardIcon 
          sx={{ 
            color: '#6B73FF', 
            mr: 1.5, 
            fontSize: 24,
            position: 'relative',
          }} 
        />
        <Typography
          variant="h4"
          sx={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#1a1a1a',
            fontFamily: 'Poppins',
            position: 'relative',
          }}
        >
          Dashboard
        </Typography>
      </Box>
      
      <Typography
        sx={{
          color: '#666',
          mb: 3,
          fontSize: '14px',
          fontFamily: 'Poppins',
          position: 'relative',
        }}
      >
        Get insights and manage editorial workflows efficiently.
      </Typography>

      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2.5, 
          mb: 3,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        <StatCard
          title="Total Posts"
          value="195"
          icon={<DocumentIcon />}
          color="#FFFFFF"
          bgColor="rgba(255, 255, 255, 0.2)"
        />
        <StatCard
          title="Pending Review"
          value="22"
          icon={<PendingIcon />}
          color="#FFFFFF"
          bgColor="rgba(255, 255, 255, 0.2)"
        />
        <StatCard
          title="Approved"
          value="146"
          icon={<ApprovedIcon />}
          color="#FFFFFF"
          bgColor="rgba(255, 255, 255, 0.2)"
        />
      </Box>

      <Box 
        sx={{ 
          mb: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TimeIcon sx={{ color: '#6B73FF', mr: 1, fontSize: 18 }} />
          <Typography
            variant="h6"
            sx={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#1a1a1a',
              fontFamily: 'Poppins',
            }}
          >
            Latest Pending Posts
          </Typography>
        </Box>
        <Link
          href="#"
          sx={{
            color: '#6B73FF',
            textDecoration: 'none',
            fontSize: '13px',
            fontFamily: 'Poppins',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            '&:hover': {
              color: '#000DFF',
              textDecoration: 'none',
            },
          }}
        >
          View All
        </Link>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          borderRadius: 2,
          position: 'relative',
          backgroundColor: '#FFFFFF',
          '& .MuiTableCell-root': {
            fontFamily: 'Poppins',
            padding: '12px 16px',
          },
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: '#666',
                  fontSize: '12px',
                  fontWeight: 500,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                  fontFamily: 'Poppins',
                }}
              >
                TITLE
              </TableCell>
              <TableCell
                sx={{
                  color: '#666',
                  fontSize: '12px',
                  fontWeight: 500,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                  fontFamily: 'Poppins',
                }}
              >
                CATEGORY
              </TableCell>
              <TableCell
                sx={{
                  color: '#666',
                  fontSize: '12px',
                  fontWeight: 500,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                  fontFamily: 'Poppins',
                }}
              >
                SUBMITTED
              </TableCell>
              <TableCell
                sx={{
                  color: '#666',
                  fontSize: '12px',
                  fontWeight: 500,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                  fontFamily: 'Poppins',
                }}
              >
                ACTION
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingPosts.map((post, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(107, 115, 255, 0.02)',
                  },
                }}
              >
                <TableCell
                  sx={{
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#1a1a1a',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                    fontFamily: 'Poppins',
                  }}
                >
                  {post.title}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#666',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                    textTransform: 'capitalize',
                    fontFamily: 'Poppins',
                  }}
                >
                  {post.category}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#666',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                    fontFamily: 'Poppins',
                  }}
                >
                  {post.submitted}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      color: '#6B73FF',
                      transition: 'all 0.3s ease',
                      padding: '6px',
                      '&:hover': {
                        backgroundColor: 'rgba(107, 115, 255, 0.08)',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <EditIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dashboard; 