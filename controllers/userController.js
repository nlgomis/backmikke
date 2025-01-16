const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sake = require('../models/sakeModel');  // Add this import

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Debug log
        console.log('Attempting to register user:', { name, email });
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        console.log('User created successfully:', user);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error details:', error);
        res.status(500).json({ 
            message: 'Server error during registration',
            error: error.message 
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Debug log
        console.log('Attempting to login user:', email);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id }, 
            'your-secret-key',
            { expiresIn: '30d' }
        );

        console.log('User logged in successfully:', user.name);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                quizzes: user.quizzes || []
            }
        });
    } catch (error) {
        console.error('Login error details:', error);
        res.status(500).json({ 
            message: 'Server error during login',
            error: error.message 
        });
    }
};

const updateUsername = async (req, res) => {
    try {
        const { name } = req.body;
        
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name;
        await user.save();

        res.json({
            message: 'Username updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                quizzes: user.quizzes || []
            }
        });
    } catch (error) {
        console.error('Update username error:', error);
        res.status(500).json({ 
            message: 'Server error during username update',
            error: error.message 
        });
    }
};

const updateQuizzes = async (req, res) => {
    try {
        const { quizResult } = req.body;
        
        // Use findOneAndUpdate to handle the case where quizzes array doesn't exist
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { 
                $push: { quizzes: quizResult }  // This will create the array if it doesn't exist
            },
            { 
                new: true,  // Return the updated document
                upsert: true,  // Create the document if it doesn't exist
                setDefaultsOnInsert: true  // Apply schema defaults if creating new doc
            }
        );
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Quiz result saved successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                quizzes: user.quizzes
            }
        });
    } catch (error) {
        console.error('Update quizzes error:', error);
        res.status(500).json({ 
            message: 'Server error while saving quiz result',
            error: error.message 
        });
    }
};


const getUserQuizzes = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('quizzes');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Reverse the quizzes array before processing
        const reversedQuizzes = [...user.quizzes].reverse();

        const sakePromises = reversedQuizzes.map(async (sakeName) => {
            const sake = await Sake.findOne({
                name: { $regex: sakeName, $options: 'i' }
            });
            return sake ? {
                id: sake.id,
                name: sakeName
            } : null;
        });

        const sakeResults = await Promise.all(sakePromises);
        const validResults = sakeResults.filter(sake => sake !== null);

        res.json(validResults);
    } catch (error) {
        console.error('Error fetching user quizzes:', error);
        res.status(500).json({
            message: 'Server error while fetching quiz history',
            error: error.message
        });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    updateUsername, 
    updateQuizzes,
    getUserQuizzes
};