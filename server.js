const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const sakeRoutes = require('./routes/sakeRoutes')
const likeRoutes = require('./routes/likeRoutes')
const app = express();

// CORS configuration


app.use(cors({
  origin: ['http://localhost:3000', 'https://sakemikke.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/sake', sakeRoutes)
app.use('/api/likes', likeRoutes)
// Health check endpoint (Azure uses this to monitor the app)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Sakemikke API' });
});

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 8080; // Azure prefers port 8080 as default
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});