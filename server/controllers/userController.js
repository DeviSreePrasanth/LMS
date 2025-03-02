const User = require('../models/User');
const Loan = require('../models/Loan');
const bcrypt = require('bcryptjs');

// Get all students (users with role 'student')
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password'); // Include profileImage by default
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single student by ID with loan history
const getStudentById = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' }).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const loans = await Loan.find({ studentId: student._id }).populate('studentId', 'name email studentId profileImage');
    res.status(200).json({ ...student.toObject(), loanHistory: loans });
  } catch (error) {
    console.error('Error fetching student by ID:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all loans (active and history) for a student by studentId (User._id)
const getStudentLoans = async (req, res) => {
  const { studentId } = req.query;
  try {
    if (!studentId) {
      return res.status(400).json({ message: 'studentId query parameter is required' });
    }
    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const loans = await Loan.find({ studentId }).populate('studentId', 'name email studentId profileImage');
    res.status(200).json(loans);
  } catch (error) {
    console.error('Error fetching student loans:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a new student (create a User with role 'student')
const addStudent = async (req, res) => {
  const { name, email, studentId, password, profileImage } = req.body; // Added profileImage
  try {
    if (!name || !email || !studentId || !password) {
      return res.status(400).json({ message: 'Name, email, studentId, and password are required' });
    }

    const existingStudent = await User.findOne({ $or: [{ email }, { studentId }] });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this email or studentId already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = new User({
      name,
      email,
      studentId,
      password: hashedPassword,
      role: 'student',
      profileImage: profileImage || null, // Optional profileImage on creation
    });
    await newStudent.save();

    res.status(201).json({
      id: newStudent._id,
      name: newStudent.name,
      email: newStudent.email,
      studentId: newStudent.studentId,
      role: newStudent.role,
      profileImage: newStudent.profileImage,
    });
  } catch (error) {
    console.error('Error adding student:', error.message);
    res.status(500).json({ message: 'Failed to add student', error: error.message });
  }
};

// Get a student by email
const getStudentByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const student = await User.findOne({ email, role: 'student' }).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student by email:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// New: Update student profile (e.g., profileImage)
const updateStudentProfile = async (req, res) => {
  const { email } = req.params;
  const { profileImage } = req.body;
  try {
    const student = await User.findOneAndUpdate(
      { email, role: 'student' },
      { profileImage },
      { new: true, runValidators: true }
    ).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error('Error updating student profile:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentLoans,
  addStudent,
  getStudentByEmail,
  updateStudentProfile, // Export new function
};