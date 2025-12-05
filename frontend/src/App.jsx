// frontend/src/App.jsx (Corrected - /matches points to Matches.jsx)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, GlobalStyles } from '@mui/material';
import { store } from './store';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SwipeStack from './components/matching/SwipeStack';
import Discover from './pages/Discover';
import NotFound from './pages/NotFound';
import AuthSessionDialog from './components/common/AuthSessionDialog';
import MatchedFriends from './pages/MatchedFriends';
import Matches from './pages/Matches';  // Your main matches page
import NearbyPeople from './pages/NearbyPeople';
import PersonalityMatch from './pages/PersonalityMatch';
import LocalEvents from './pages/LocalEvents';
// Add these routes to your App.jsx

const theme = createTheme({
  palette: {
    primary: { main: '#6366f1' },
    secondary: { main: '#ec4899' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: 'clamp(2rem, 5vw, 4rem)' },
    h2: { fontSize: 'clamp(1.75rem, 4vw, 3rem)' },
    h3: { fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' },
    h4: { fontSize: 'clamp(1.25rem, 3vw, 2rem)' },
    h5: { fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' },
    h6: { fontSize: 'clamp(1rem, 2vw, 1.25rem)' },
    body1: { fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' },
    body2: { fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)' },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const globalStyles = (
  <GlobalStyles
    styles={{
      '*': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
      },
      'html, body': {
        width: '100%',
        height: '100%',
        overflowX: 'hidden',
      },
      '#root': {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      },
      '::-webkit-scrollbar': {
        width: 'clamp(4px, 1vw, 8px)',
      },
      '::-webkit-scrollbar-track': {
        background: '#f1f1f1',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#6366f1',
        borderRadius: '10px',
      },
    }}
  />
);

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {globalStyles}
        <Router>
          <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            width: '100%',
            maxWidth: '100vw',
            overflow: 'hidden'
          }}>
            <Header />
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              minHeight: 0,
            }}>
              <Routes>
                <Route path="/discover/nearby" element={<NearbyPeople />} />
                <Route path="/discover/personality" element={<PersonalityMatch />} />
                <Route path="/discover/events" element={<LocalEvents />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/analytics" element={<Dashboard />} />
                <Route path="/matched-friends" element={<MatchedFriends />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<LoginForm />} />
              </Routes>
            </Box>
            <Footer />
            <AuthSessionDialog />
          </Box>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
