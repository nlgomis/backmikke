const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true 
    },
    quizzes: {
        type: [String],
        default: []
    },
    image: {
        type: String,
        required: true,
    }

}, { 
    timestamps: true 
});

const User = mongoose.model('User', userSchema);

module.exports = User;