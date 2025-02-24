const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  getStudentLoans,
  addStudent,
} = require('../controllers/studentController');

// Routes for students
router.get('/students', getAllStudents); // Get all students
router.get('/students/:id', getStudentById); // Get a single student with loan history
router.get('/loans', getStudentLoans); // Get loans for a student by studentId
router.post('/students', addStudent); // Add a new student

module.exports = router;