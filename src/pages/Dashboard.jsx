import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActionArea
} from '@mui/material';
import { 
  Logout, 
  Dashboard as DashboardIcon,
  Business,
  Schedule,
  Person,
  Settings,
  TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const dashboardCards = [
    {
      title: 'Service Stations',
      description: 'Browse and manage service stations',
      icon: <Business sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary',
      path: '/service-stations'
    },
    {
      title: 'Appointments',
      description: 'View and manage your appointments',
      icon: <Schedule sx={{ fontSize: 40, color: 'secondary.main' }} />,
      color: 'secondary',
      path: '/appointments'
    },
    {
      title: 'Profile',
      description: 'Manage your account settings',
      icon: <Person sx={{ fontSize: 40, color: 'info.main' }} />,
      color: 'info',
      path: '/profile'
    },
    {
      title: 'Analytics',
      description: 'View service statistics and reports',
      icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success',
      path: '/analytics'
    }
  ];

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ marginTop: 4, marginBottom: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <DashboardIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography component="h1" variant="h4" gutterBottom>
            Welcome back, {user?.username || 'User'}!
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Manage your car services and appointments from one place
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {dashboardCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => navigate(card.path)}
                  sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <Box sx={{ mb: 2 }}>
                    {card.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom textAlign="center">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {card.description}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Business />}
              onClick={() => navigate('/service-stations')}
            >
              Browse Stations
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Schedule />}
              onClick={() => navigate('/appointments')}
            >
              Book Appointment
            </Button>
            <Button
              variant="outlined"
              color="info"
              startIcon={<Settings />}
              onClick={() => navigate('/profile')}
            >
              Settings
            </Button>
          </Box>
        </Box>

        {token && (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>
              Authentication Status
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Your authentication token is stored and will be automatically included in all API requests.
            </Typography>
            <Chip 
              label={token ? token.substring(0, 50) + '...' : 'No token'} 
              variant="outlined" 
              sx={{ wordBreak: 'break-all' }}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard; 