// frontend/src/components/auth/LoginForm.jsx (Responsive)
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  CircularProgress,
  Container,
  Box
} from '@mui/material';
import { AuthController } from '../../controllers/authController';

const LoginContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem);
`;

const LoginCard = styled(motion.div)`
  width: 100%;
  max-width: clamp(350px, 90vw, 450px);
`;

const StyledCard = styled(Card)`
  border-radius: clamp(16px, 3vw, 24px) !important;
  box-shadow: 0 clamp(8px, 2vw, 15px) clamp(30px, 5vw, 50px) rgba(0,0,0,0.1) !important;
  overflow: hidden;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 3vw, 1.5rem);
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await AuthController.handleLogin(dispatch, credentials);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <LoginContainer maxWidth={false}>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledCard>
          <CardContent sx={{ 
            padding: { xs: 3, sm: 4, md: 5 }
          }}>
            <Box textAlign="center" mb={4}>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Welcome Back
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: 1.6
                }}
              >
                Sign in to find your perfect AI-matched friends
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {error}
              </Alert>
            )}

            <StyledForm onSubmit={handleSubmit}>
              <TextField
                name="email"
                type="email"
                label="Email Address"
                value={credentials.email}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }
                }}
              />

              <TextField
                name="password"
                type="password"
                label="Password"
                value={credentials.password}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                fullWidth
                sx={{ 
                  mt: 2,
                  borderRadius: 3,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 600,
                  textTransform: 'none',
                  padding: { xs: '12px', sm: '16px' },
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a5fd8 0%, #7c3aed 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
                  }
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </StyledForm>

            <Typography 
              variant="body2" 
              align="center" 
              sx={{ 
                mt: 3,
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}
            >
              Don't have an account?{' '}
              <Button 
                variant="text" 
                onClick={() => navigate('/register')}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                Sign Up
              </Button>
            </Typography>
          </CardContent>
        </StyledCard>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginForm;
