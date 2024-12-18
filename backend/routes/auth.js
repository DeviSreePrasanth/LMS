const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Student = require('../models/student');



// Environment Variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Register Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input fields
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  try {
    // Check if the user already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: 'Student already exists with this email!' });
    }

    // Hash the password before saving the student
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new student with hashed password
    const student = new Student({ username, email, password: hashedPassword });

    // Save the student to the database
    await student.save();

    // Optionally, generate JWT token on registration (you can remove this part if not needed)
    const token = jwt.sign({ id: student._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Student registered successfully!', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find student by username
    const student = await Student.findOne({ username });
    if (!student) {
      return res.status(404).json({ error: 'Student not found!' });
    }

    // Check if entered password matches the hashed password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials!' });
    }

    // Create a JWT token
    const token = jwt.sign({ id: student._id }, JWT_SECRET, { expiresIn: '1h' });
    
    // Send token and success message
    res.status(200).json({ message: 'Login successful!', token });
  } catch (error) {
    res.status(500).json({ error: 'Server error!' });
  }
});

module.exports = router;
