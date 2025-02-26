const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register User
const registerUser = async (req, res) => {
    const { name, email, password, studentId, role } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Prevent librarian registration through this endpoint
        if (role === 'librarian') {
            return res.status(403).json({ message: 'Librarian role must be assigned manually by admin' });
        }

        // Validate studentId for students
        if (role === 'student' && !studentId) {
            return res.status(400).json({ message: 'Student ID is required for students' });
        }

        // Check if studentId is unique if provided
        if (studentId) {
            const existingStudent = await User.findOne({ studentId });
            if (existingStudent) {
                return res.status(400).json({ message: 'Student ID already in use' });
            }
        }

        user = new User({
            name,
            email,
            password,
            studentId: studentId || undefined, // Only set if provided
            role: role || 'student' // Default to student if not specified
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Create JWT payload
        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        // Sign JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                studentId: user.studentId
            }
        });
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password, studentId } = req.body;

    try {
        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // For students, verify studentId if provided or required
        if (user.role === 'student') {
            if (!studentId) {
                return res.status(400).json({ message: 'Student ID is required for students' });
            }
            if (studentId !== user.studentId) {
                return res.status(400).json({ message: 'Invalid student ID' });
            }
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user._id,
                role: user.role,
                email: user.email
            }
        };

        // Generate JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send response
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                studentId: user.studentId || null
            }
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = { registerUser, loginUser };