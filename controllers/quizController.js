// controllers/quizController.js
const Quiz = require('../models/quizModel');

const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find()
            .populate('createdBy', 'name')
            .select('-questions.correctAnswer');
        res.json(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ message: 'Server error while fetching quizzes' });
    }
};

const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .populate('createdBy', 'name');
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'Server error while fetching quiz' });
    }
};

module.exports = { getQuizzes, getQuizById };