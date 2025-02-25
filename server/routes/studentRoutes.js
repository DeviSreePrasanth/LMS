const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  getStudentLoans,
  addStudent,
  getStudentByEmail, // New controller function for email lookup
} = require('../controllers/studentController');

// Routes for students
router.get('/students', getAllStudents); // Get all students
router.get('/students/:id', getStudentById); // Get a single student by ID with loan history
router.get('/loans', getStudentLoans); // Get loans for a student by studentId
router.post('/students', addStudent); // Add a new student
router.get('/students/email/:email', getStudentByEmail); // New route to get student by email

module.exports = router;