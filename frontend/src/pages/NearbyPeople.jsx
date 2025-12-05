import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Card, CardContent, Avatar, Chip, Button, CircularProgress } from '@mui/material';
import { People, LocationOn, Message, Refresh } from '@mui/icons-material';
import DiscoveryPageTemplate from '@components/common/DiscoveryPageTemplate';
import { getLocationMatches } from '@services/api'; // Changed import

const NearbyPeople = () => {
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState('');

  useEffect(() => {
    console.log('🚀 NearbyPeople component mounted, starting location fetch...');
    fetchNearbyPeople();
  }, []);

  const fetchNearbyPeople = async () => {
    console.log('📍 Starting fetchNearbyPeople with LocationMatchService...');
    
    try {
      setLoading(true);
      setError(null);
      
      const userId = localStorage.getItem('userId');
      console.log('👤 User ID from localStorage:', userId);
      
      if (!userId) {
        console.log('❌ No userId found in localStorage');
        setError('Please log in to find nearby people');
        return;
      }
      
      console.log('📍 Calling getLocationMatches...');
      
      // Use location-only matching
      const response = await getLocationMatches(userId, { limit: 20 });
      
      console.log('📨 Location matches response:', response);
      console.log('📊 Service used:', response.service);
      console.log('📍 User location:', response.userLocation);
      
      setUserLocation(response.userLocation || '');
      
      if (response && response.matches) {
        console.log('✅ Location matches found:', response.matches.length);
        
        // Log each match
        response.matches.forEach((match, index) => {
          console.log(`👥 Match #${index + 1}:`, {
            user: match.user?.firstName || 'No name',
            location: match.user?.location || 'No location',
            locationMatch: match.locationMatch
          });
        });
        
        setNearbyUsers(response.matches);
      } else {
        console.log('❌ No matches in response');
        setNearbyUsers([]);
      }
      
    } catch (error) {
      console.error('💥 Error in fetchNearbyPeople:', error);
      setError(`Failed to fetch nearby people: ${error.message}`);
    } finally {
      setLoading(false);
      console.log('🏁 fetchNearbyPeople completed');
    }
  };

  const handleMessage = (userId, firstName) => {
    console.log(`💬 Message button clicked for ${firstName} (${userId})`);
    alert(`Message feature coming soon! You want to message ${firstName}`);
  };

  const handleRefresh = () => {
    console.log('🔄 Refresh button clicked');
    fetchNearbyPeople();
  };

  return (
    <DiscoveryPageTemplate
      title="People in Your Area"
      subtitle={`Find people in similar locations ${userLocation ? `(Your location: ${userLocation})` : ''}`}
      icon={People}
      color="#4caf50"
      gradient="linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)"
    >
      {/* Debug Info Panel */}
      <Box sx={{ 
        mb: 3, 
        p: 2, 
        bgcolor: 'rgba(76,175,80,0.1)', 
        borderRadius: 2,
        border: '1px solid rgba(76,175,80,0.3)'
      }}>
        <Typography variant="h6" sx={{ color: '#4caf50' }} gutterBottom>
          📍 Location Matching Info
        </Typography>
        <Typography variant="body2" component="div">
          • Your Location: {userLocation || 'Not found'}<br/>
          • People Found: {nearbyUsers.length}<br/>
          • Loading: {loading ? 'Yes' : 'No'}<br/>
          • Error: {error || 'None'}
        </Typography>
      </Box>

      {/* Controls */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Button 
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={loading}
          variant="outlined"
          sx={{ borderColor: '#4caf50', color: '#4caf50' }}
        >
          Refresh Location Matches
        </Button>
      </Box>

      {/* Error */}
      {error && (
        <Box sx={{ textAlign: 'center', mb: 3, p: 2, bgcolor: 'rgba(244,67,54,0.1)', borderRadius: 2 }}>
          <Typography color="error" variant="body1">
            {error}
          </Typography>
        </Box>
      )}

      {/* Loading */}
      {loading && (
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <CircularProgress sx={{ color: '#4caf50' }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Finding people in your area...
          </Typography>
        </Box>
      )}

      {/* Results Grid */}
      <Grid container spacing={3}>
        {nearbyUsers.map((match, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-8px)', 
                boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)' 
              }
            }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
                    src={match.user?.profileImages?.[0]?.url}
                  >
                    {match.user?.firstName?.charAt(0) || '?'}
                  </Avatar>
                  <Typography variant="h6">
                    {match.user?.firstName || 'Unknown'}, {match.user?.age || '??'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                    <LocationOn fontSize="small" sx={{ color: '#4caf50', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {match.user?.location || 'Location unknown'}
                    </Typography>
                  </Box>
                  
                  <Chip 
                    label="Location Match ✅"
                    size="small"
                    sx={{ 
                      mt: 1,
                      background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  {match.user?.interests?.slice(0, 3).map((interest, idx) => (
                    <Chip 
                      key={idx} 
                      label={interest} 
                      size="small" 
                      sx={{ mr: 0.5, mb: 0.5, fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>

                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ 
                        borderRadius: 2,
                        borderColor: '#4caf50',
                        color: '#4caf50',
                        textTransform: 'none'
                      }}
                    >
                      View Profile
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="contained"
                      fullWidth
                      size="small"
                      startIcon={<Message />}
                      onClick={() => handleMessage(match.user?._id, match.user?.firstName)}
                      sx={{ 
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
                        textTransform: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #388e3c, #1b5e20)'
                        }
                      }}
                    >
                      Message
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Results */}
      {!loading && nearbyUsers.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No people found in your area
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userLocation ? 
              `No other users found with location similar to: ${userLocation}` :
              'Make sure your location is set in your profile.'
            }
          </Typography>
        </Box>
      )}
    </DiscoveryPageTemplate>
  );
};

export default NearbyPeople;
