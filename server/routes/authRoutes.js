const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const jwt = require('jsonwebtoken');

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Token verification route
router.get('/verify', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

  if (!token) {
    return res.status(401).send({ message: 'Authentication required' });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request for further use
    res.send({ message: 'Token is valid', user: decoded });
  } catch (e) {
    res.status(401).send({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
