// src/pages/Matches.jsx (Enhanced with AI matching support)
import React, { useState, useEffect } from 'react';
import { 
  Typography, Container, Box, Tab, Tabs, Card, CardContent, 
  List, ListItem, ListItemText, ListItemAvatar, Avatar, 
  CircularProgress, Alert, Button, Grid, Chip
} from '@mui/material';
import { useSelector } from 'react-redux';
import SwipeStack from '../components/matching/SwipeStack';
import { getMatches, getMatchStats } from '../services/api';

const Matches = () => {
  console.log('🟢 [INIT] Matches component mounted');

  const [activeTab, setActiveTab] = useState(0);
  const [matches, setMatches] = useState([]);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [aiMatchStats, setAiMatchStats] = useState(null);

  const currentUser = useSelector((state) => state.auth?.user);
  const token = useSelector((state) => state.auth?.token) || localStorage.getItem('token');

  console.log('📦 [STATE INIT]', { activeTab, token, currentUser });

  // Extract a usable userId from multiple possible sources
  const getUserId = () => {
    console.log('🔍 [FUNC] getUserId called');
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    const sources = [
      currentUser?.id,
      currentUser?._id,
      currentUser?.userId,
      localUser?.id,
      localUser?._id,
      localUser?.userId
    ];
    const userId = sources.find(id => id && typeof id === 'string' && id.length >= 12);
    console.log('🛠 [getUserId] Sources:', {
      redux_id: currentUser?.id,
      redux__id: currentUser?._id,
      redux_userId: currentUser?.userId,
      localUser,
      selected: userId
    });
    return userId;
  };

  // Authenticated fetch wrapper
  const makeAuthenticatedRequest = async (url, options = {}) => {
    console.log(`🚀 [API CALL] ${url}`);
    const authToken = token || localStorage.getItem('token');
    if (!authToken) throw new Error('No authentication token available');

    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const requestOptions = { ...defaultOptions, ...options };
    const response = await fetch(url, requestOptions);

    console.log(`📡 [RESPONSE STATUS] ${url} → ${response.status}`);

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Authentication expired. Please log in again.');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const jsonData = await response.json();
    console.log(`📨 [DATA RECEIVED] ${url}`, jsonData);
    return jsonData;
  };

  // Data loader
  useEffect(() => {
    console.log('⚡ [EFFECT] useEffect triggered', { currentUser, token });

    const fetchMatchData = async () => {
      console.log('🏁 [FETCH START]');
      setLoading(true);
      setError(null);

      const authToken = token || localStorage.getItem('token');
      if (!authToken) {
        console.warn('❌ [TOKEN MISSING]');
        setError('Please log in to view matches');
        setLoading(false);
        return;
      }

      const userId = getUserId();
      if (!userId) {
        console.warn('❌ [USER ID MISSING]');
        setError('User ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      console.log(`🎯 [TARGET USER] ID = ${userId}`);
      console.log(`🔐 [AUTH TOKEN] ${authToken.substring(0, 20)}...`);

      // 1️⃣ Matches
      try {
        console.log('📱 [STEP 1] Fetching matches...');
        const matchesResponse = await getMatches(userId);
        console.log('✅ [MATCHES RESPONSE]', matchesResponse);
        setMatches(matchesResponse?.success ? (matchesResponse.data?.matches || []) : []);
      } catch (err) {
        console.error('❌ [FETCH MATCHES ERROR]', err);
        setMatches([]);
      }

      // 2️⃣ AI-Powered Potential matches
      try {
        console.log('🤖 [STEP 2] Fetching AI-powered potential matches...');
        const potentialResponse = await makeAuthenticatedRequest(`/api/matches/${userId}/potential?limit=20&minScore=0.3`);
        console.log('✅ [AI POTENTIAL RESPONSE]', potentialResponse);
        
        if (potentialResponse?.success) {
          const potentialData = potentialResponse.data?.potentialMatches || [];
          // ✅ ADD THESE DEBUG LOGS
          console.log('🎯 [DEBUG] Raw potentialData:', potentialData);
          console.log('🎯 [DEBUG] First match structure:', potentialData[0]);
          console.log('🎯 [DEBUG] First match compatibilityScore:', potentialData[0]?.compatibilityScore);
          console.log('🎯 [DEBUG] All compatibilityScores:', potentialData.map(match => match.compatibilityScore));
          
          setPotentialMatches(potentialData);
          setAiMatchStats(potentialResponse.data?.filterStats);
          console.log(`🤖 [AI MATCHES] Found ${potentialData.length} AI-powered matches`);
          
          // ✅ Log AI match quality stats
          if (potentialResponse.data?.filterStats) {
            console.log('📊 [AI FILTER STATS]', potentialResponse.data.filterStats);
          }
        } else {
          setPotentialMatches([]);
          setAiMatchStats(null);
        }
      } catch (err) {
        console.error('❌ [FETCH AI POTENTIAL ERROR]', err);
        setPotentialMatches([]);
        setAiMatchStats(null);
      }

      // 3️⃣ Stats
      try {
        console.log('📈 [STEP 3] Fetching statistics...');
        const statsResponse = await getMatchStats(userId);
        console.log('✅ [STATS RESPONSE]', statsResponse);
        setStats(statsResponse?.success ? (statsResponse.data?.stats || null) : null);
      } catch (err) {
        console.error('❌ [FETCH STATS ERROR]', err);
        setStats(null);
      }

      console.log('🏁 [FETCH COMPLETE]');
      setLoading(false);
    };

    if (currentUser || localStorage.getItem('user')) {
      fetchMatchData();
    } else {
      console.warn('⚠️ [NO USER FOUND]');
      setError('Please log in to view matches');
      setLoading(false);
    }
  }, [currentUser, token]);

  const handleTabChange = (event, newValue) => {
    console.log(`🔄 [TAB CHANGE] ${activeTab} → ${newValue}`);
    setActiveTab(newValue);
  };

  const handleRetry = () => {
    console.log('🔄 [RETRY FETCH]');
    window.location.reload();
  };

  const handleLogin = () => {
    console.log('➡️ [GO TO LOGIN]');
    window.location.href = '/login';
  };

  const renderMatches = () => {
    console.log('🖌 [RENDER] Matches Tab');
    if (matches.length === 0) {
      return (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No matches yet. Keep swiping to find AI-powered friends!
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }} 
            onClick={() => setActiveTab(1)}
          >
            Start Swiping
          </Button>
        </Box>
      );
    }
    return (
      <List>
        {matches.map((match, index) => (
          <ListItem key={match.user?._id || match.user?.id || index} divider>
            <ListItemAvatar>
              <Avatar 
                src={match.user?.primaryProfileImage || '/default-avatar.png'} 
                alt={match.user?.firstName || 'User'}
                sx={{ width: 56, height: 56 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${match.user?.firstName || 'Unknown'} ${match.user?.lastName || 'User'}`}
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Compatibility: {match.compatibilityScore || 0}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Matched on: {match.matchedAt ? new Date(match.matchedAt).toLocaleDateString() : 'Unknown date'}
                  </Typography>
                  <Box mt={1}>
                    <Chip 
                      label={match.matchType || 'match'} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={match.status || 'active'} 
                      size="small" 
                      color={match.status === 'active' ? 'success' : 'default'}
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };

  const renderSwipeStack = () => {
    console.log('[DEBUG] potentialMatches in renderSwipeStack:', potentialMatches);
    console.log('🖌 [RENDER] AI Discover Tab');
    
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          🤖 AI-Powered Friend Discovery
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Our AI analyzes your interests, writing style, and preferences to find your perfect matches!
        </Typography>
        
        {/* ✅ AI Stats Display */}
        {aiMatchStats && (
          <Box sx={{ mb: 3, p: 2, backgroundColor: 'rgba(106, 27, 154, 0.1)', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 600 }}>
              🎯 AI Analysis: Found {aiMatchStats.beforeFiltering} potential matches, showing top {aiMatchStats.afterFiltering} after filtering
            </Typography>
          </Box>
        )}
        
        {/* Pass AI-enhanced potentialMatches as cards prop to SwipeStack */}
        <SwipeStack cards={potentialMatches} />
      </Box>
    );
  };

  const renderStats = () => {
    console.log('🖌 [RENDER] Statistics Tab');
    if (!stats) {
      return (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No statistics available yet.
          </Typography>
        </Box>
      );
    }
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {stats.totalMatches || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Matches
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary">
                {stats.activeMatches || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Matches
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {stats.matchRate || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Match Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {stats.totalLikes || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Likes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  if (loading) {
    console.log('⏳ [LOADING STATE]');
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading your AI-powered matches...
        </Typography>
      </Container>
    );
  }

  if (error) {
    console.error('🚫 [ERROR STATE]', error);
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">Failed to Load Matches</Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="contained" onClick={handleRetry}>Try Again</Button>
          {error.includes('log in') && (
            <Button variant="outlined" onClick={handleLogin}>Go to Login</Button>
          )}
        </Box>
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Debug Info:</strong><br/>
            User logged in: {currentUser ? 'Yes' : 'No'}<br/>
            Token present: {token ? 'Yes' : 'No'}<br/>
            User ID: {getUserId() || 'Not found'}<br/>
            Current User Object: {JSON.stringify(currentUser || {}, null, 2)}
          </Typography>
        </Alert>
      </Container>
    );
  }

  console.log('🖥 [RENDER MAIN UI]');
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        🤖 AI Friend Finder
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        AI-powered friend matching using advanced compatibility algorithms and machine learning.
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="matches tabs">
          <Tab label={`My Matches (${matches.length})`} />
          <Tab label={`🤖 AI Discover (${potentialMatches.length})`} />
          <Tab label="Statistics" />
        </Tabs>
      </Box>
      <Box>
        {activeTab === 0 && renderMatches()}
        {activeTab === 1 && renderSwipeStack()}
        {activeTab === 2 && renderStats()}
      </Box>
    </Container>
  );
};

export default Matches;
