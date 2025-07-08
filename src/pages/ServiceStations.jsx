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
  Alert
} from '@mui/material';
import { Add, Edit, Delete, LocationOn, Phone, Email } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api.js';

const ServiceStations = () => {
  const { user } = useAuth();
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
        setMessage('Service station updated successfully!');
      } else {
        await api.post('/api/accounts/service-stations/', form);
        setMessage('Service station created successfully!');
      }
      setSeverity('success');
      setOpenDialog(false);
      setEditingStation(null);
      resetForm();
      fetchStations();
    } catch (error) {
      setMessage('Failed to save service station');
      setSeverity('error');
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
        setMessage('Service station deleted successfully!');
        setSeverity('success');
        fetchStations();
      } catch (error) {
        setMessage('Failed to delete service station');
        setSeverity('error');
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

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ marginTop: 4, marginBottom: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography component="h1" variant="h4">
            Service Stations
          </Typography>
          {(user?.role === 'admin' || user?.role === 'stations') && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEditingStation(null);
                resetForm();
                setOpenDialog(true);
              }}
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
          {stations.map((station) => (
            <Grid item xs={12} md={6} lg={4} key={station.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {station.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {station.address}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {station.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {station.email}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    {station.services_offered.map((service) => (
                      <Chip
                        key={service.id}
                        label={service.name}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </CardContent>
                {(user?.role === 'admin' || (user?.role === 'stations' && station.owner === user.id)) && (
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEdit(station)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDelete(station.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

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
      </Box>
    </Container>
  );
};

export default ServiceStations; 