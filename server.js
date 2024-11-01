const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const session = require('express-session');

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors({
    origin: [
      'http://localhost:3000',
      'https://sakemikke.vercel.app',
      'https://www.sakemikke.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5050;

// Check if we're in Vercel's production environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for Vercel
module.exports = app;