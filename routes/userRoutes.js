// routes/userRoutes.js


const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    updateUsername, 
    updateQuizzes,
    getUserQuizzes,
    updateUserImage 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.put('/update-username', protect, updateUsername);
router.put('/update-quizzes', protect, updateQuizzes);
router.get('/quiz-history', protect, getUserQuizzes);
router.put('/update-image', protect, updateUserImage);  // New route

module.exports = router;