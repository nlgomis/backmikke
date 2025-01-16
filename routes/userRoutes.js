// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUsername, updateQuizzes, getUserQuizzes } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update-username', protect, updateUsername);
router.put('/update-quizzes', protect, updateQuizzes);
router.get('/quiz-history', protect, getUserQuizzes);
module.exports = router;