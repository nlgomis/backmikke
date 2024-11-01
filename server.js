const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');

const app = express();

// CORS Middleware - BEFORE all other middleware and routes
app.use(cors({
  origin: '*',  // Allow all origins temporarily for testing
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle OPTIONS preflight for all routes
app.options('*', cors());

// Other middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);

module.exports = app;