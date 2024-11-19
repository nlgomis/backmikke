const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
                email: user.email
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
        
        // req.user is set by the protect middleware
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
                email: user.email
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

module.exports = { registerUser, loginUser, updateUsername };