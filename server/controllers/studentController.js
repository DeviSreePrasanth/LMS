const Student = require('../models/Student');
const Loan = require('../models/Loan');

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single student by ID with loan history
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const loans = await Loan.find({ studentId: student._id });
    res.status(200).json({ ...student.toObject(), loanHistory: loans });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all loans (active and history) for a student by studentId
const getStudentLoans = async (req, res) => {
  const { studentId } = req.query;
  try {
    const loans = await Loan.find({ studentId }).populate('studentId', 'name email');
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a new student
const addStudent = async (req, res) => {
  const { name, email, studentId } = req.body;
  try {
    // Check if student with the same email or studentId already exists
    const existingStudent = await Student.findOne({ $or: [{ email }, { studentId }] });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this email or ID already exists' });
    }

    const newStudent = new Student({ name, email, studentId });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add student' });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentLoans,
  addStudent,
};