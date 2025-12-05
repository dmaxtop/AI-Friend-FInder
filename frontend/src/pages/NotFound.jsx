// frontend/src/pages/NotFound.jsx
import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home } from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: 'calc(100vh - 140px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <Typography variant="h1" component="h1" sx={{ 
        fontSize: '6rem',
        fontWeight: 700,
        color: 'primary.main',
        mb: 2
      }}>
        404
      </Typography>
      
      <Typography variant="h4" component="h2" gutterBottom>
        Page Not Found
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        The page you're looking for doesn't exist in our AI Friend Finder app.
      </Typography>
      
      <Button
        variant="contained"
        startIcon={<Home />}
        onClick={() => navigate('/dashboard')}
        sx={{ 
          mt: 2,
          borderRadius: 2,
          textTransform: 'none'
        }}
      >
        Go to Dashboard
      </Button>
    </Container>
  );
};

export default NotFound;
