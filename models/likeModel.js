const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sakeId: {
    type: String,  // Changed to String to match Sake model's id field
    required: true,
    ref: 'Sake'  // Add reference to Sake model
  }
}, {
  timestamps: true,
  versionKey: false
});

likeSchema.index({ userId: 1, sakeId: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);