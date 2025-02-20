const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bid: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['issued', 'available'],
        default: 'available', 
        required: true
    }
}, {
    timestamps: true  
});


module.exports = mongoose.model('Book', bookSchema);
