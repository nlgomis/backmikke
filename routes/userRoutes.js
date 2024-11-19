// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUsername } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update-username', protect, updateUsername);

module.exports = router;