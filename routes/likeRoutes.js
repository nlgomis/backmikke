const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { toggleLike, getLikedSakes, checkLikeStatus } = require('../controllers/likeController');

router.post('/toggle', protect, toggleLike);
router.get('/', protect, getLikedSakes);
router.get('/check/:sakeId', protect, checkLikeStatus);

module.exports = router;