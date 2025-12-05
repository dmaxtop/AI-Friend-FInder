// frontend/src/pages/MatchedFriends.jsx (New page for matched friends)
import React from 'react';
import { Container, Typography, Box, Card, CardContent, Avatar, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Message, Favorite } from '@mui/icons-material';
import styled from 'styled-components';

const PageContainer = styled(Container)`
  padding: clamp(2rem, 4vw, 4rem);
  min-height: calc(100vh - 140px);
`;

const PageTitle = styled(Typography)`
  font-size: clamp(1.8rem, 4vw, 2.8rem) !important;
  font-weight: 800 !important;
  text-align: center !important;
  color: #6a1b9a !important;
  margin-bottom: 2rem !important;
`;

const MatchCard = styled(Card)`
  border-radius: 20px !important;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(106, 27, 154, 0.2) !important;
  }
`;

const MatchedFriends = () => {
  const navigate = useNavigate();

  // Mock matched friends data
  const matchedFriends = [
    {
      id: 1,
      firstName: 'Alice',
      age: 25,
      location: 'New York',
      profileImage: null,
      matchPercentage: 92,
      status: 'Both liked each other'
    },
    {
      id: 2,
      firstName: 'Sarah',
      age: 27,
      location: 'San Francisco',
      profileImage: null,
      matchPercentage: 88,
      status: 'Both liked each other'
    }
  ];

  return (
    <PageContainer maxWidth="lg">
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mr: 2, color: '#6a1b9a' }}
        >
          Back
        </Button>
        <PageTitle variant="h3" sx={{ flex: 1 }}>
          Your Matched Friends 💕
        </PageTitle>
      </Box>

      {matchedFriends.length === 0 ? (
        <Box textAlign="center" sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ color: '#7b1fa2', mb: 2 }}>
            No matches yet!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Keep swiping to find your perfect friends.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/matches')}
            sx={{ 
              mt: 3,
              background: 'linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%)',
              borderRadius: 2
            }}
          >
            Start Swiping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {matchedFriends.map((friend) => (
            <Grid key={friend.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <MatchCard>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar
                    src={friend.profileImage}
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      margin: '0 auto 16px',
                      background: 'linear-gradient(135deg, #6a1b9a, #4a148c)'
                    }}
                  >
                    {friend.firstName.charAt(0)}
                  </Avatar>
                  
                  <Typography variant="h6" sx={{ color: '#4a148c', fontWeight: 700, mb: 1 }}>
                    {friend.firstName}, {friend.age}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: '#7b1fa2', mb: 2 }}>
                    {friend.location}
                  </Typography>
                  
                  <Box sx={{ 
                    background: 'rgba(76, 175, 80, 0.1)', 
                    borderRadius: 2, 
                    p: 1, 
                    mb: 2 
                  }}>
                    <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                      <Favorite sx={{ fontSize: '1rem', mr: 0.5 }} />
                      {friend.matchPercentage}% Match
                    </Typography>
                  </Box>
                  
                  <Button
                    variant="contained"
                    startIcon={<Message />}
                    fullWidth
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%)'
                    }}
                  >
                    Start Chatting
                  </Button>
                </CardContent>
              </MatchCard>
            </Grid>
          ))}
        </Grid>
      )}
    </PageContainer>
  );
};

export default MatchedFriends;
