import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Card, CardContent, Button, Chip, Avatar, AvatarGroup } from '@mui/material';
import { LocationOn, Event as EventIcon, People, Schedule } from '@mui/icons-material';
import DiscoveryPageTemplate from '../components/common/DiscoveryPageTemplate';

const LocalEvents = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Weekend Coffee Meetup',
      description: 'Join us for a casual coffee meetup to discuss books, travel, and life experiences.',
      location: 'Dhaka, Dhanmondi',
      date: '2025-09-08',
      time: '3:00 PM',
      attendees: 12,
      category: 'Social',
      organizer: 'Sarah Ahmed',
      image: null
    },
    {
      id: 2,
      title: 'Photography Walk',
      description: 'Explore the old town while practicing street photography with fellow enthusiasts.',
      location: 'Old Dhaka',
      date: '2025-09-10',
      time: '9:00 AM',
      attendees: 8,
      category: 'Photography',
      organizer: 'Rafiq Hassan',
      image: null
    },
    {
      id: 3,
      title: 'Board Game Night',
      description: 'Weekly board game session for strategy game lovers. All skill levels welcome!',
      location: 'Gulshan, Dhaka',
      date: '2025-09-12',
      time: '7:00 PM',
      attendees: 15,
      category: 'Gaming',
      organizer: 'Fatima Khan',
      image: null
    }
  ]);

  const getCategoryColor = (category) => {
    const colors = {
      'Social': '#4caf50',
      'Photography': '#2196f3',
      'Gaming': '#9c27b0',
      'Sports': '#ff5722',
      'Food': '#ff9800',
      'Tech': '#607d8b'
    };
    return colors[category] || '#757575';
  };

  return (
    <DiscoveryPageTemplate
      title="Local Events & Activities"
      subtitle="Discover local events, meetups, and activities where you can meet like-minded people"
      icon={LocationOn}
      color="#ff9800"
      gradient="linear-gradient(135deg, #ff9800 0%, #f57c00 100%)"
    >
      {/* Filter Chips */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#ff9800' }}>
          Event Categories
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          {['All', 'Social', 'Photography', 'Gaming', 'Sports', 'Food', 'Tech'].map((category) => (
            <Chip 
              key={category}
              label={category}
              clickable
              sx={{
                '&:hover': { backgroundColor: 'rgba(255, 152, 0, 0.1)' },
                borderColor: '#ff9800'
              }}
              variant="outlined"
            />
          ))}
        </Box>
      </Box>

      {/* Events Grid */}
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event.id}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-8px)', 
                boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)' 
              }
            }}>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1, pr: 1 }}>
                      {event.title}
                    </Typography>
                    <Chip 
                      label={event.category}
                      size="small"
                      sx={{ 
                        backgroundColor: getCategoryColor(event.category),
                        color: 'white',
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                    {event.description}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn fontSize="small" sx={{ color: '#666', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.location}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Schedule fontSize="small" sx={{ color: '#666', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.date} at {event.time}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <People fontSize="small" sx={{ color: '#666', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.attendees} attending
                      </Typography>
                    </Box>
                    <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
                      <Avatar>A</Avatar>
                      <Avatar>B</Avatar>
                      <Avatar>C</Avatar>
                    </AvatarGroup>
                  </Box>
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  Organized by {event.organizer}
                </Typography>

                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{ 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #f57c00, #ef6c00)'
                    }
                  }}
                >
                  Join Event
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {events.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No events found in your area
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Be the first to organize an event in your community!
          </Typography>
        </Box>
      )}

      {/* Create Event Button */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          size="large"
          startIcon={<EventIcon />}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            borderColor: '#ff9800',
            color: '#ff9800',
            '&:hover': {
              borderColor: '#f57c00',
              backgroundColor: 'rgba(255, 152, 0, 0.1)'
            }
          }}
        >
          Create Your Own Event
        </Button>
      </Box>
    </DiscoveryPageTemplate>
  );
};

export default LocalEvents;
