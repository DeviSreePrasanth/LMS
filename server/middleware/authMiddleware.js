const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication Middleware
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    
    // If no token is provided, return an error
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token with the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Add user info to req for access in subsequent middleware
        next(); // Proceed to the next middleware
    } catch (err) {
        // If token is invalid or expired, return an error
        console.error(err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Role-based Access Control Middleware
const roleMiddleware = (roles = []) => (req, res, next) => {
    // If no roles are provided, assume access is allowed for any role
    if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Access denied' });
    }
    next(); // Proceed to the next middleware if user role matches
};

module.exports = { authMiddleware, roleMiddleware };
