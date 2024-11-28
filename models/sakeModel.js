const mongoose = require('mongoose');

const sakeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,  // Add this to match the MongoDB ObjectId
    id: String,
    name: String,
    type: String,
    region: String,
    riceType: String,
    polishingRate: Number,
    price: Number,
    volume: Number,
    alcoholContent: Number,
    sakeGrade: {
        body: Number,
        fragrance: Number,
        acidity: Number,
        clarity: Number
    },
    tasteProfile: String,
    sakeLevel: mongoose.Schema.Types.Mixed,  // Using Mixed type to handle null
    classification: String,
    description: String,
    keywords: [String]
}, {
    collection: 'sake',  // Explicitly specify the collection name
    versionKey: false    // This removes the __v field
});

const Sake = mongoose.model('Sake', sakeSchema);

module.exports = Sake;