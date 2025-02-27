const Loan = require('../models/Loan');
const User = require('../models/User');
const Book = require('../models/Book');
const getRecentActivities = async (req, res) => {
  try {
    const recentLoans = await Loan.find()
      .sort({ createdAt: -1 }) // Sort by most recent
      .limit(5)
      .populate('bookId', 'title'); // Populate book title

    const activities = recentLoans.map(loan => ({
      action: `Book '${loan.bookId.title}' ${loan.returned ? 'returned' : 'issued'}`,
      timestamp: loan.createdAt,
    }));

    res.json(activities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Issue a book
const issueBook = async (req, res) => {
  const { studentId, bid, title: providedTitle, dueDate } = req.body;

  try {
    console.log('Issuing book with data:', req.body);

    if (!studentId || !bid || !dueDate) {
      return res.status(400).json({ message: 'studentId, bid, and dueDate are required' });
    }

    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const book = await Book.findOne({ bid });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const title = providedTitle && providedTitle.trim() ? providedTitle : book.title;
    if (!title) {
      return res.status(400).json({ message: 'Title cannot be determined' });
    }

    const existingLoan = await Loan.findOne({ bid, returnDate: null });
    if (existingLoan) {
      return res.status(400).json({ message: 'Book is already issued' });
    }

    const loan = new Loan({ studentId, bid, title, dueDate });
    const savedLoan = await loan.save();

    res.status(201).json({
      message: 'Book issued successfully',
      loan: savedLoan,
    });
  } catch (err) {
    console.error('Error issuing book:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all active loans
const getActiveLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ returnDate: null })
      .populate('studentId', 'name email studentId')
      .lean();

    res.status(200).json({
      loans,
    });
  } catch (err) {
    console.error('Error fetching active loans:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Return a book
const returnBook = async (req, res) => {
  const { id } = req.params;
  const { returnDate } = req.body;

  try {
    const loan = await Loan.findById(id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan record not found' });
    }

    if (loan.returnDate) {
      return res.status(400).json({ message: 'Book already returned' });
    }

    loan.returnDate = returnDate || new Date();
    const updatedLoan = await loan.save();

    res.status(200).json({ message: 'Book returned successfully', record: updatedLoan });
  } catch (err) {
    console.error('Error returning book:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getRecentActivities,issueBook, getActiveLoans, returnBook };