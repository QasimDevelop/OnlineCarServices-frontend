import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Grid,
  Link
} from '@mui/material';
import { Login } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Signin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('username', form.username);
      params.append('password', form.password);
      params.append('client_id', 'KL8uNl44etGZn2ZVOMbVW5OtZkgjAoOhOI2I27eS');
      params.append('client_secret', 'PwClt96M0dNWHEnXEFos17iYPZ525gIOFyaJlz88LGhRv1ShxCNmQkYfWpqF9GnhXabssTbRqQ9nAQi38XYHoIOkbvjg2rN3XaYyr77fugAlafRP2OvOT9V2iU9W2sin');


      const { data } = await axios.post('http://127.0.0.1:8000/o/token/', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      // Store token in context and display it
      login(data.access_token);
      setMessage('Login successful! Token received.');
      setSeverity('success');
      setForm({ username: '', password: '' });
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setMessage('Login failed: ' + (err.response?.data?.error_description || 'Unknown error'));
      setSeverity('error');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
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
            <Login sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography component="h1" variant="h4">
              Sign In
            </Typography>
          </Box>

          {message && (
            <Alert severity={severity} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" align="center" sx={{ mb: 1 }}>
              OR
            </Typography>
            <GoogleLoginButton onLogin={login} />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signin;
