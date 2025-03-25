const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    studentId: { 
        type: String, 
        unique: true, 
        required: [ 
            function() { return this.role === 'student'; }, 
            'Student ID is required for students'
        ],
        sparse: true // Allows null values while maintaining uniqueness
    },
    role: { type: String, enum: ['librarian', 'student'], required: true },
    profileImage: { type: String, default: null } // New field for profile image URL
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);