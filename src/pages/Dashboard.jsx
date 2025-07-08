import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Chip
} from '@mui/material';
import { Logout, Dashboard as DashboardIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <DashboardIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography component="h1" variant="h4">
              Dashboard
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Welcome! You are successfully logged in.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Your authentication token is stored and will be automatically included in all API requests.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Current Token (first 50 characters):
            </Typography>
            <Chip 
              label={token ? token.substring(0, 50) + '...' : 'No token'} 
              variant="outlined" 
              sx={{ wordBreak: 'break-all' }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/service-stations')}
            >
              Service Stations
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/appointments')}
            >
              Appointments
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard; 