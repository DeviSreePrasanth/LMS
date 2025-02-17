const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register User
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Only add librarian role through backend, not registration
        if (role === 'librarian') {
            return res.status(400).json({ msg: 'Librarian role should be assigned manually' });
        }

        user = new User({
            name,
            email,
            password,
            role
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Skip JWT creation if it's causing issues
        const payload = { user: { id: user.id } };

        let token = '';
        try {
            token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        } catch (err) {
            console.error('JWT Error:', err.message); // Log JWT error, but continue without token
        }

        // Send success response with or without token
        res.json({
            msg: 'Registration successful',
            token: token || null, // Send token if available
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare the password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create a payload with user id and role
        const payload = { user: { id: user._id, role: user.role } }; // Using _id instead of id to match MongoDB's default field name

        // Generate the JWT token with an expiration time of 1 hour
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the response containing the token and role
        res.json({
            token,
            user: { id: user._id, role: user.role } // Send both the user ID and role in the response
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


module.exports = { registerUser, loginUser };
