import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CardActionArea,
  IconButton,
  Tooltip,
  Rating,
  Fab,
  Snackbar
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  LocationOn, 
  Phone, 
  Email, 
  BookOnline,
  Schedule,
  Star,
  Directions,
  AccessTime,
  Business,
  CheckCircle,
  Warning,
  Info
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api.js';

const ServiceStations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
    services_offered: []
  });
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchStations();
    fetchServiceTypes();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await api.get('/api/accounts/service-stations/');
      setStations(response.data);
    } catch (error) {
      setMessage('Failed to fetch service stations');
      setSeverity('error');
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const response = await api.get('/api/accounts/service-types/');
      setServiceTypes(response.data);
    } catch (error) {
      console.error('Failed to fetch service types:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStation) {
        await api.put(`/api/accounts/service-stations/${editingStation.id}/`, form);
        setSnackbarMessage('Service station updated successfully!');
      } else {
        await api.post('/api/accounts/service-stations/', form);
        setSnackbarMessage('Service station created successfully!');
      }
      setSnackbarOpen(true);
      setOpenDialog(false);
      setEditingStation(null);
      resetForm();
      fetchStations();
    } catch (error) {
      setSnackbarMessage('Failed to save service station');
      setSnackbarOpen(true);
    }
  };

  const handleEdit = (station) => {
    setEditingStation(station);
    setForm({
      name: station.name,
      address: station.address,
      latitude: station.latitude || '',
      longitude: station.longitude || '',
      phone: station.phone,
      email: station.email,
      services_offered: station.services_offered.map(s => s.id)
    });
    setOpenDialog(true);
  };

  const handleDelete = async (stationId) => {
    if (window.confirm('Are you sure you want to delete this service station?')) {
      try {
        await api.delete(`/api/accounts/service-stations/${stationId}/`);
        setSnackbarMessage('Service station deleted successfully!');
        setSnackbarOpen(true);
        fetchStations();
      } catch (error) {
        setSnackbarMessage('Failed to delete service station');
        setSnackbarOpen(true);
      }
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      phone: '',
      email: '',
      services_offered: []
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBookAppointment = (station) => {
    // Show feedback before navigation
    setSnackbarMessage(`Redirecting to book appointment at ${station.name}...`);
    setSnackbarOpen(true);
    
    // Navigate to appointments page with station pre-selected
    setTimeout(() => {
      navigate('/appointments', { 
        state: { 
          selectedStation: station,
          fromServiceStations: true 
        } 
      });
    }, 1000);
  };

  const handleGetDirections = (station) => {
    const { latitude, longitude } = station;
    if (latitude && longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      window.open(url, '_blank');
    } else {
      // Fallback to address search
      const url = `https://www.google.com/maps/search/${encodeURIComponent(station.address)}`;
      window.open(url, '_blank');
    }
  };

  const getStationStatus = (station) => {
    // Mock status - in real app this would come from backend
    const now = new Date().getHours();
    if (now >= 8 && now <= 18) {
      return { status: 'open', color: 'success', icon: <CheckCircle /> };
    } else {
      return { status: 'closed', color: 'error', icon: <Warning /> };
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ marginTop: 4, marginBottom: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography component="h1" variant="h4" gutterBottom>
              Service Stations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Find and book services at nearby car service stations
            </Typography>
          </Box>
          {(user?.role === 'admin' || user?.role === 'stations') && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEditingStation(null);
                resetForm();
                setOpenDialog(true);
              }}
              sx={{ borderRadius: 2 }}
            >
              Add Service Station
            </Button>
          )}
        </Box>

        {message && (
          <Alert severity={severity} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Grid container spacing={3}>
          {stations.map((station) => {
            const statusInfo = getStationStatus(station);
            return (
              <Grid item xs={12} md={6} lg={4} key={station.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8,
                    }
                  }}
                >
                  <CardActionArea 
                    onClick={() => handleBookAppointment(station)}
                    sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    <CardContent sx={{ flex: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {station.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Rating value={4.2} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary">
                            (4.2)
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" color="text.secondary">
                          {station.address}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Phone sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" color="text.secondary">
                          {station.phone}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Email sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" color="text.secondary">
                          {station.email}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {statusInfo.icon}
                        <Chip
                          label={statusInfo.status}
                          color={statusInfo.color}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                          Services Offered:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {station.services_offered.map((service) => (
                            <Chip
                              key={service.id}
                              label={service.name}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                fontSize: '0.75rem',
                                '&:hover': {
                                  backgroundColor: 'primary.light',
                                  color: 'white',
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                  
                  <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Book Appointment">
                        <IconButton
                          color="primary"
                          onClick={() => handleBookAppointment(station)}
                          size="small"
                          sx={{
                            backgroundColor: 'primary.light',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                            }
                          }}
                        >
                          <BookOnline />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Get Directions">
                        <IconButton
                          color="secondary"
                          onClick={() => handleGetDirections(station)}
                          size="small"
                          sx={{
                            backgroundColor: 'secondary.light',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'secondary.dark',
                            }
                          }}
                        >
                          <Directions />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    {(user?.role === 'admin' || (user?.role === 'stations' && station.owner === user.id)) && (
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit Station">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(station);
                            }}
                            sx={{
                              backgroundColor: 'info.light',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'info.dark',
                              }
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Station">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(station.id);
                            }}
                            sx={{
                              backgroundColor: 'error.light',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'error.dark',
                              }
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Floating Action Button for quick booking */}
        <Fab
          color="primary"
          aria-label="book appointment"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
          onClick={() => navigate('/appointments')}
        >
          <BookOnline />
        </Fab>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingStation ? 'Edit Service Station' : 'Add Service Station'}
          </DialogTitle>
          <Box component="form" onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    type="number"
                    step="any"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Longitude"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    type="number"
                    step="any"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Services Offered</InputLabel>
                    <Select
                      multiple
                      name="services_offered"
                      value={form.services_offered}
                      onChange={handleChange}
                      label="Services Offered"
                    >
                      {serviceTypes.map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          {service.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editingStation ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* Snackbar for feedback */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      </Box>
    </Container>
  );
};

export default ServiceStations; 