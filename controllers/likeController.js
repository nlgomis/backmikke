const Like = require('../models/likeModel');
const Sake = require('../models/sakeModel');
const mongoose = require('mongoose');

const toggleLike = async (req, res) => {
  try {
    const { sakeId } = req.body;
    const userId = req.user._id;

    const existingLike = await Like.findOne({ userId, sakeId });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      return res.json({ message: 'Like removed', liked: false });
    }

    const sake = await Sake.findOne({ id: sakeId });
    if (!sake) {
      return res.status(404).json({ message: 'Sake not found' });
    }

    const like = await Like.create({ userId, sakeId });
    return res.json({ message: 'Like added', liked: true });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error while toggling like' });
  }
};

const getLikedSakes = async (req, res) => {
  try {
    const userId = req.user._id;
    const likes = await Like.find({ userId });
    
    const likedSakes = await Sake.find({
      id: { $in: likes.map(like => like.sakeId) }
      
    });
    
    res.json(likedSakes);
  } catch (error) {
    console.error('Get liked sakes error:', error);
    res.status(500).json({ message: 'Server error while fetching liked sakes' });
  }
};

const checkLikeStatus = async (req, res) => {
  try {
    const { sakeId } = req.params;
    const userId = req.user._id;

    const like = await Like.findOne({ userId, sakeId });
    res.json({ liked: !!like });
  } catch (error) {
    console.error('Check like status error:', error);
    res.status(500).json({ message: 'Server error while checking like status' });
  }
};

module.exports = { toggleLike, getLikedSakes, checkLikeStatus };