import React, { useState, useEffect, useContext } from 'react';
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
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  CardActionArea,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  Schedule, 
  Business, 
  Person,
  BookOnline,
  LocationOn,
  Phone,
  Email,
  CalendarToday,
  AccessTime,
  Notes,
  CheckCircle,
  Pending,
  Cancel,
  Directions
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api.js';
import AuthProvider  from "../context/AuthContext";
import ScheduleForm from './ScheduleForm';
import {AuthContext} from '../context/AuthContext';
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";

const fetchNearbyStations = async (lat, lng, radius, token) => {
  const res = await axios.get(
    "http://localhost:8000/api/accounts/service-stations/nearby/",
    {
      params: { lat, lng, radius },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

const fetchServiceTypes = async (token) => {
  const res = await axios.get(
    "http://localhost:8000/api/accounts/service-types/",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

const Appointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [serviceStations, setServiceStations] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [form, setForm] = useState({
    service_station: '',
    service_type: '',
    appointment_date: '',
    appointment_time: '',
    notes: ''
  });
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const { token } = useContext(AuthContext);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  
  // Check if we came from ServiceStations with a pre-selected station
  const preSelectedStation = location.state?.selectedStation;
  const fromServiceStations = location.state?.fromServiceStations;

  useEffect(() => {
    fetchAppointments();
    fetchServiceStations();
    fetchServiceTypes();
    
    // If we have a pre-selected station from ServiceStations, set it up
    if (preSelectedStation && fromServiceStations) {
      setSelectedStation(preSelectedStation.id);
      setForm(prev => ({
        ...prev,
        service_station: preSelectedStation.id
      }));
      // Clear the location state to prevent re-applying on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [preSelectedStation, fromServiceStations, navigate, location.pathname]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/api/accounts/appointments/');
      setAppointments(response.data);
    } catch (error) {
      setMessage('Failed to fetch appointments');
      setSeverity('error');
    }
  };

  const fetchServiceStations = async () => {
    try {
      const response = await api.get('/api/accounts/service-stations/');
      setServiceStations(response.data);
    } catch (error) {
      console.error('Failed to fetch service stations:', error);
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
    setLoading(true);
    setMessage('');
    setSeverity('info');
    try {
      if (editingAppointment) {
        // Update existing appointment
        await axios.put(
          `http://localhost:8000/api/accounts/appointments/${editingAppointment.id}/`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Appointment updated successfully!");
      } else {
        // Create new appointment
        await axios.post(
          "http://localhost:8000/api/accounts/appointments/",
          {
            service_station: selectedStation,
            service_type: selectedService,
            appointment_date: date,
            appointment_time: time,
            notes,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Appointment scheduled successfully!");
      }
      setSeverity("success");
      setOpenDialog(false);
      setEditingAppointment(null);
      setForm({
        service_station: '',
        service_type: '',
        appointment_date: '',
        appointment_time: '',
        notes: ''
      });
      setSelectedStation('');
      setSelectedService('');
      setDate('');
      setTime('');
      setNotes('');
      await fetchAppointments();
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
        "Failed to schedule/update appointment. Please check your input."
      );
      setSeverity("error");
    }
    setLoading(false);
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setForm({
      service_station: appointment.service_station,
      service_type: appointment.service_type,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      notes: appointment.notes || ''
    });
    setOpenDialog(true);
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await api.delete(`/api/accounts/appointments/${appointmentId}/`);
        setMessage('Appointment deleted successfully!');
        setSeverity('success');
        fetchAppointments();
      } catch (error) {
        setMessage('Failed to delete appointment');
        setSeverity('error');
      }
    }
  };

  const resetForm = () => {
    setForm({
      service_station: '',
      service_type: '',
      appointment_date: '',
      appointment_time: '',
      notes: ''
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle />;
      case 'pending': return <Pending />;
      case 'in_progress': return <Schedule />;
      case 'completed': return <CheckCircle />;
      case 'cancelled': return <Cancel />;
      default: return <Schedule />;
    }
  };

  const formatDateTime = (date, time) => {
    if (!date) return 'Not scheduled';
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString();
    const formattedTime = time || 'TBD';
    return `${formattedDate} at ${formattedTime}`;
  };

  const handleSearch = async () => {
    setLoading(true);
    // Replace with user's actual location
    const lat = 33.6844;
    const lng = 73.0479;
    const radius = 10;
    try {
      const data = await fetchNearbyStations(lat, lng, radius, token);
      // Filter for stations offering "Oil changing"
      const filtered = data.filter(station =>
        station.services_offered.some(
          service => service.name.toLowerCase() === "oil changing"
        )
      );
      setStations(filtered);
    } catch (err) {
      alert("Failed to fetch stations.");
    }
    setLoading(false);
  };

  const handleSchedule = (station) => {
    const oilService = station.services_offered.find(
      s => s.name.toLowerCase() === "oil changing"
    );
    setSelectedStation(station.id);
    setSelectedService(oilService ? oilService.id : '');
    setDate('');
    setTime('');
    setNotes('');
    setEditingAppointment(null);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedStation(null);
    setSelectedService(null);
  };

  // Only allow today or future dates
  const minDate = dayjs().format("YYYY-MM-DD");

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ marginTop: 4, marginBottom: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography component="h1" variant="h4">
            Appointments
          </Typography>
          {user?.role === 'user' && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEditingAppointment(null);
                resetForm();
                setOpenDialog(true);
              }}
            >
              Book Appointment
            </Button>
          )}
        </Box>

        {message && (
          <Alert severity={severity} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Find Nearby Stations"}
          </Button>
          <Paper elevation={2}>
            <List>
              {stations.map(station => (
                <ListItem
                  key={station.id}
                  secondaryAction={
                    <Button
                      variant="outlined"
                      onClick={() => handleSchedule(station)}
                    >
                      Schedule
                    </Button>
                  }
                >
                  <ListItemText
                    primary={station.name}
                    secondary={station.address}
                  />
                </ListItem>
              ))}
            </List>
            {stations.length === 0 && !loading && (
              <Box p={2}>
                <Typography>No stations found within 10 km offering Oil changing.</Typography>
              </Box>
            )}
          </Paper>
        </div>

        <Grid container spacing={3}>
          {appointments.map((appointment) => (
            <Grid item xs={12} md={6} lg={4} key={appointment.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  }
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {appointment.service_station_name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getStatusIcon(appointment.status)}
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Business sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {appointment.service_type_name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDateTime(appointment.appointment_date, appointment.appointment_time)}
                    </Typography>
                  </Box>

                  {appointment.user_name && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Person sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {appointment.user_name}
                      </Typography>
                    </Box>
                  )}

                  {appointment.notes && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                      <Notes sx={{ fontSize: 16, mr: 1, color: 'text.secondary', mt: 0.2 }} />
                      <Typography variant="body2" color="text.secondary">
                        {appointment.notes}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 1 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      ID: #{appointment.id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(appointment.created_at || Date.now()).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit Appointment">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(appointment)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Appointment">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(appointment.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  {appointment.service_station_latitude && appointment.service_station_longitude && (
                    <Tooltip title="Get Directions">
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => {
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${appointment.service_station_latitude},${appointment.service_station_longitude}`;
                          window.open(url, '_blank');
                        }}
                      >
                        <Directions />
                      </IconButton>
                    </Tooltip>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingAppointment ? 'Edit Appointment' : 'Book Appointment'}
          </DialogTitle>
          <Box component="form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Service Station</InputLabel>
                    <Select
                      name="service_station"
                      value={editingAppointment ? form.service_station : selectedStation}
                      onChange={editingAppointment
                        ? (e) => setForm({ ...form, service_station: e.target.value })
                        : (e) => setSelectedStation(e.target.value)
                      }
                      label="Service Station"
                      required
                    >
                      {serviceStations.map((station) => (
                        <MenuItem key={station.id} value={station.id}>
                          {station.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Service Type</InputLabel>
                    <Select
                      name="service_type"
                      value={editingAppointment ? form.service_type : selectedService}
                      onChange={editingAppointment
                        ? (e) => setForm({ ...form, service_type: e.target.value })
                        : (e) => setSelectedService(e.target.value)
                      }
                      label="Service Type"
                      required
                      disabled={
                        editingAppointment
                          ? !form.service_station
                          : !selectedStation
                      }
                    >
                      {(editingAppointment
                        ? serviceStations.find(s => s.id === form.service_station)
                        : serviceStations.find(s => s.id === selectedStation)
                      )?.services_offered.map(service => (
                        <MenuItem key={service.id} value={service.id}>
                          {service.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    name="appointment_date"
                    value={editingAppointment ? form.appointment_date : date}
                    onChange={editingAppointment
                      ? (e) => setForm({ ...form, appointment_date: e.target.value })
                      : (e) => setDate(e.target.value)
                    }
                    type="date"
                    required
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: minDate }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Time"
                    type="time"
                    value={editingAppointment ? form.appointment_time : time}
                    onChange={editingAppointment
                      ? (e) => setForm({ ...form, appointment_time: e.target.value })
                      : (e) => setTime(e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    name="notes"
                    value={editingAppointment ? form.notes : notes}
                    onChange={editingAppointment
                      ? (e) => setForm({ ...form, notes: e.target.value })
                      : (e) => setNotes(e.target.value)
                    }
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editingAppointment ? 'Update' : 'Book'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Appointments; 