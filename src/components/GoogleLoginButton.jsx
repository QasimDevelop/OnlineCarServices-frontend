import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { Google } from '@mui/icons-material';

const GoogleLoginButton = ({ onLogin }) => {
  const handleGoogleLogin = () => {
    // Implement Google OAuth flow here
    // For now, this is a placeholder
    console.log('Google login clicked');
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={<Google />}
      onClick={handleGoogleLogin}
      sx={{
        mt: 2,
        mb: 2,
        borderColor: '#4285f4',
        color: '#4285f4',
        '&:hover': {
          borderColor: '#3367d6',
          backgroundColor: 'rgba(66, 133, 244, 0.04)',
        },
      }}
    >
      <Typography variant="body1">
        Continue with Google
      </Typography>
    </Button>
  );
};

export default GoogleLoginButton;
