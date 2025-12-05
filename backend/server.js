// backend/server.js (WITH DEBUGGING STEPS)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();


const authRoutes = require('./routes/authRoutes');



let userRoutes, eventRoutes, matchRoutes;

try {
  userRoutes = require('./routes/userRoutes');
  console.log('✅ User routes loaded successfully');
} catch (error) {
  console.warn('⚠️  User routes not found:', error.message);
  userRoutes = null;
}


// DEBUG: Testing MatchController and dependencies

console.log('🔍 TESTING MATCHCONTROLLER DEPENDENCIES...');

try {
  console.log('1. Testing MatchController direct import...');
  const MatchController = require('./controllers/matchController');
  console.log('✅ MatchController loaded successfully');
  console.log('📋 MatchController type:', typeof MatchController);
  console.log('📋 MatchController methods:', Object.getOwnPropertyNames(MatchController));
} catch (error) {
  console.error('❌ MATCHCONTROLLER FAILED TO LOAD:');
  console.error('   Message:', error.message);
  console.error('   Stack trace first line:', error.stack.split('\n')[1]);
  console.error('   🎯 THIS IS YOUR EXACT PROBLEM!');
}

console.log('🧪 TESTING INDIVIDUAL DEPENDENCIES...');

const testDependencies = [
  { name: 'User Model', path: './models/User' },
  { name: 'CompatibilityScore Model', path: './models/CompatibilityScore' },
  { name: 'AIMatchingService', path: './services/aiMatchingService' },
];

for (const dep of testDependencies) {
  try {
    console.log(`   Testing: ${dep.name}...`);
    const module = require(dep.path);
    console.log(`   ✅ ${dep.name}: OK`);
  } catch (error) {
    console.error(`   ❌ ${dep.name}: FAILED`);
    console.error(`      Error: ${error.message}`);
    console.error(`      Stack: ${error.stack.split('\n')[1]}`);
    console.error(`      🎯 FOUND THE PROBLEM: ${dep.path}`);
    break; // Stop at first failure
  }
}

// ===== LOCATION MATCH SERVICE DEBUG =====
console.log('🔍 TESTING LOCATION MATCH SERVICE DIRECTLY...');

try {
  console.log('1. Testing LocationMatchService import...');
  const LocationMatchService = require('./services/locationMatchService');
  console.log('✅ LocationMatchService imported successfully');
  console.log('📋 Type:', typeof LocationMatchService);
  
  if (typeof LocationMatchService === 'object') {
    console.log('📋 Available methods:', Object.keys(LocationMatchService));
  } else if (typeof LocationMatchService === 'function') {
    console.log('📋 Static methods:', Object.getOwnPropertyNames(LocationMatchService));
  }

  // Test if it has the expected method
  if (LocationMatchService.findLocationMatches) {
    console.log('✅ findLocationMatches method exists');
  } else {
    console.warn('⚠️  findLocationMatches method NOT found');
    console.log('📋 Available methods:', Object.keys(LocationMatchService));
  }

  // Test other common methods
  const commonMethods = ['getLocationEmbedding', 'calculateDistance', 'findNearbyUsers'];
  commonMethods.forEach(method => {
    if (LocationMatchService[method]) {
      console.log(`✅ ${method} method exists`);
    } else {
      console.log(`❌ ${method} method missing`);
    }
  });

} catch (error) {
  console.error('❌ LOCATION MATCH SERVICE FAILED TO LOAD:');
  console.error('   Error Type:', error.constructor.name);
  console.error('   Error Message:', error.message);
  console.error('   File Path: ./services/locationMatchService');
  
  if (error.stack) {
    console.error('   Stack Trace:');
    error.stack.split('\n').slice(0, 5).forEach(line => {
      console.error('     ', line);
    });
  }
  
  console.error('   🎯 THIS IS LIKELY YOUR PROBLEM!');
}

// Test syntax of the file directly
console.log('🔍 TESTING FILE SYNTAX...');
try {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, 'services', 'locationMatchService.js');
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log('📁 File exists, size:', content.length, 'characters');
    
    // Check for problematic content
    if (content.includes('<') && !content.includes('console.log')) {
      console.warn('⚠️  File contains "<" characters (potential HTML):');
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.includes('<') && !line.includes('//') && !line.includes('console.log')) {
          console.warn(`   Line ${index + 1}: ${line.trim()}`);
        }
      });
    }
    
    // Check for ES module syntax
    if (content.includes('import ') || content.includes('export ')) {
      console.warn('⚠️  File contains ES module syntax:');
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if ((line.includes('import ') || line.includes('export ')) && !line.includes('//')) {
          console.warn(`   Line ${index + 1}: ${line.trim()}`);
        }
      });
    }
    
    console.log('📄 First 200 characters:');
    console.log('   "' + content.substring(0, 200).replace(/\n/g, '\\n') + '"');
    
  } else {
    console.error('❌ File does not exist:', filePath);
  }
  
} catch (fileError) {
  console.error('❌ File system check failed:', fileError.message);
}

// Test Node.js syntax check
console.log('🔍 RUNNING NODE SYNTAX CHECK...');
try {
  const { execSync } = require('child_process');
  const result = execSync('node --check services/locationMatchService.js', { 
    cwd: __dirname,
    encoding: 'utf8',
    stdio: 'pipe'
  });
  console.log('✅ Node syntax check passed');
} catch (syntaxError) {
  console.error('❌ Node syntax check FAILED:');
  console.error('   Output:', syntaxError.stdout);
  console.error('   Error:', syntaxError.stderr);
  console.error('   🎯 SYNTAX ERROR CONFIRMED!');
}

console.log('🔍 === LOCATION SERVICE DEBUG COMPLETE ===\n');



try {
  eventRoutes = require('./routes/eventRoutes');
  console.log('✅ Event routes loaded successfully');
} catch (error) {
  console.warn('⚠️  Event routes not found:', error.message);
  eventRoutes = null;
}


try {
  matchRoutes = require('./routes/matchRoutes');
  console.log('✅ Match routes loaded successfully');
} catch (error) {
  console.warn('⚠️  Match routes not found:', error.message);
  matchRoutes = null;
}


// Middleware configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ✅ Request logging middleware
app.use((req, res, next) => {
  console.log(`🌐 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});


// Database connection status
let isDBConnected = false;


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'AI Friend Finder Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: isDBConnected ? 'Connected' : 'Disconnected'
  });
});


// ✅ API Routes (MUST come BEFORE catch-all routes)
app.use('/api/auth', authRoutes);


if (userRoutes) {
  app.use('/api/users', userRoutes);
  console.log(`👤 User endpoints: http://localhost:5000/api/users`);
}


if (eventRoutes) {
  app.use('/api/events', eventRoutes);
  console.log(`🎉 Event endpoints: http://localhost:5000/api/events`);
}


if (matchRoutes) {
  app.use('/api/matches', matchRoutes);
  console.log(`💕 Match endpoints: http://localhost:5000/api/matches`);
}


// ✅ MOVED TO THE END - Catch-all route for API (only for truly unmatched routes)
app.use('/api/*', (req, res) => {
  console.log(`❌ [API 404] No route found for: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found`,
    availableRoutes: {
      auth: '/api/auth',
      users: userRoutes ? '/api/users' : 'Not available',
      events: eventRoutes ? '/api/events' : 'Not available',
      matches: matchRoutes ? '/api/matches' : 'Not available',
      health: '/api/health'
    }
  });
});


// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });


  res.status(err.status || 500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});


// Database connection
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-friend-finder';
    
    await mongoose.connect(MONGODB_URI);
    
    isDBConnected = true;
    console.log('✅ Connected to MongoDB successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
  } catch (error) {
    isDBConnected = false;
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Solutions:');
    console.log('   1. Install and start MongoDB locally');
    console.log('   2. Use MongoDB Atlas cloud database');
    console.log('   3. Check your MONGODB_URI in .env file');
  }
};


// Initialize database connection
connectDB();


// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('🚀 AI Friend Finder Backend Server Started');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log(`🗄️  Database status: ${isDBConnected ? 'Connected' : 'Disconnected'}`);
});


// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    if (isDBConnected) {
      mongoose.connection.close();
    }
    process.exit(0);
  });
});


process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    if (isDBConnected) {
      mongoose.connection.close();
    }
    process.exit(0);
  });
});


module.exports = app;
