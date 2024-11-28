// controllers/sakeController.js
const Sake = require('../models/sakeModel');

const getAllSake = async (req, res) => {
    try {
        // Debug log
        console.log('Fetching all sake products');

        const sakeList = await Sake.find({});
        
        if (!sakeList || sakeList.length === 0) {
            return res.status(404).json({ message: 'No sake products found' });
        }

        console.log(`Found ${sakeList.length} sake products`);

        res.json({
            count: sakeList.length,
            data: sakeList
        });
    } catch (error) {
        console.error('Error fetching sake products:', error);
        res.status(500).json({
            message: 'Server error while fetching sake products',
            error: error.message
        });
    }
};

const getSakeByName = async (req, res) => {
    try {
        const { name } = req.params;
        
        // Debug log
        console.log('Searching for sake by name:', name);

        // Using regex for a case-insensitive partial match
        const sake = await Sake.findOne({
            name: { $regex: name, $options: 'i' }
        });

        if (!sake) {
            return res.status(404).json({ message: 'Sake not found' });
        }

        console.log('Found sake:', sake.name);

        res.json(sake);
    } catch (error) {
        console.error('Error fetching sake by name:', error);
        res.status(500).json({
            message: 'Server error while fetching sake',
            error: error.message
        });
    }
};

module.exports = { getAllSake, getSakeByName };