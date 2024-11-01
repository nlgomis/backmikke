// routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const { getQuizzes, getQuizById } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getQuizzes);
router.get('/:id', protect, getQuizById);

module.exports = router;