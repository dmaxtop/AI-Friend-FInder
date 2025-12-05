// src/components/auth/RegisterForm.jsx (Updated to store token before upload)
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
  Grid
} from '@mui/material';
import { AuthController } from '../../controllers/authController';
import UserController from '../../controllers/userController';

const RegisterCard = styled(motion.div)`
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    location: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const [profileImages, setProfileImages] = useState([]); // For selected files
  const [imagePreviews, setImagePreviews] = useState([]); // For image previews

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    setProfileImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.age) errors.age = 'Age is required';
    if (formData.age < 18) errors.age = 'You must be at least 18 years old';
    if (!formData.location.trim()) errors.location = 'Location is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await AuthController.handleRegister(dispatch, formData);
    
    if (result.success) {
      // FIXED: Store the token in localStorage immediately after registration
      localStorage.setItem('token', result.token);  // Assuming result includes the token from backend

      // Upload images if selected
      if (profileImages.length > 0) {
        const uploadData = new FormData();
        profileImages.forEach(file => {
          uploadData.append('images', file);
        });
        uploadData.append('imageType', 'profile');

        try {
          await UserController.uploadProfileImages(result.user.id, uploadData);
        } catch (uploadError) {
          console.error('Image upload failed after registration:', uploadError);
          alert('Registration successful, but image upload failed. You can upload later from your profile.');
        }
      }

      navigate('/dashboard');
    }
  };

  return (
    <RegisterCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Join AI Friend Finder
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
            Create your profile and let AI find your perfect friends
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <StyledForm onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!validationErrors.firstName}
                  helperText={validationErrors.firstName}
                  required
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!validationErrors.lastName}
                  helperText={validationErrors.lastName}
                  required
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <TextField
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              required
              fullWidth
              variant="outlined"
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="age"
                  type="number"
                  label="Age"
                  value={formData.age}
                  onChange={handleChange}
                  error={!!validationErrors.age}
                  helperText={validationErrors.age}
                  required
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="location"
                  label="Location"
                  value={formData.location}
                  onChange={handleChange}
                  error={!!validationErrors.location}
                  helperText={validationErrors.location}
                  required
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <TextField
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              required
              fullWidth
              variant="outlined"
            />

            <TextField
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
              required
              fullWidth
              variant="outlined"
            />

            {/* Image Upload Section */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button variant="contained" component="label" fullWidth>
                  Upload Profile Images (max 5)
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
              </Grid>
            </Grid>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <Grid container spacing={1} sx={{ mt: 1 }}>
                {imagePreviews.map((preview, index) => (
                  <Grid item key={index}>
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
          </StyledForm>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Button variant="text" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </RegisterCard>
  );
};

export default RegisterForm;
