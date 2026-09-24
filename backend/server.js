const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'CyberVault CTF Platform API',
    timestamp: new Date().toISOString(),
  });
});

// Root fallback route
app.get('/', (req, res) => {
  res.send('CyberVault CTF Backend API Server is Running.');
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(`[-] Internal Error: ${err.message}`);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`[+] CyberVault CTF Backend running on port ${PORT}`);
  console.log(`[+] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=======================================================`);
});
