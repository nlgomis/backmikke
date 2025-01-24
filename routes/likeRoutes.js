const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { toggleLike, getLikedSakes, checkLikeStatus } = require('../controllers/likeController');

router.post('/api/likes/toggle', protect, toggleLike);
router.get('/api/likes', protect, getLikedSakes);
router.get('/api/likes/check/:sakeId', protect, checkLikeStatus);

module.exports = router;