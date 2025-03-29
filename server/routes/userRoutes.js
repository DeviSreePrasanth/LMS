const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  getStudentLoans,
  addStudent,
  getStudentByEmail,
  updateStudentProfile,
} = require('../controllers/userController');

router.get('/students', getAllStudents); // Get all students
router.get('/students/:id', getStudentById); // Get a single student by ID with loan history
router.get('/loans', getStudentLoans); // Get loans for a student by studentId (User._id)
router.post('/students', addStudent); // Add a new student
router.get('/students/email/:email', getStudentByEmail); // Get student by email
router.put('/students/email/:email', updateStudentProfile); // Update student profile (e.g., profileImage)

module.exports = router;