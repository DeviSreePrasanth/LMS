const Loan = require('../models/Loan');
const User = require('../models/User');
const Book = require('../models/Book');

const getRecentActivities = async (req, res) => {
  try {
    const recentLoans = await Loan.find()
      .sort({ createdAt: -1 })
      .limit(5);

    if (!recentLoans.length) {
      return res.json([]);
    }

    // Manually fetch book titles for each loan
    const activities = await Promise.all(
      recentLoans.map(async (loan) => {
        const book = await Book.findOne({ bid: loan.bid });
        const bookTitle = book ? book.title : 'Unknown Book'; // Fallback if book not found
        return {
          action: `Book '${bookTitle}' ${loan.returnDate ? 'returned' : 'issued'}`,
          timestamp: loan.createdAt,
        };
      })
    );

    res.json(activities);
  } catch (error) {
    console.error('Error fetching recent activities:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const issueBook = async (req, res) => {
  const { studentId, bid, dueDate } = req.body;

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

    const existingLoan = await Loan.findOne({ bid, returnDate: null });
    if (existingLoan) {
      return res.status(400).json({ message: 'Book is already issued' });
    }

    const loan = new Loan({
      studentId,
      bid,
      title: book.title, // Fetch title from Book
      dueDate,
    });
    const savedLoan = await loan.save();

    book.status = 'issued';
    await book.save();

    res.status(201).json({
      message: 'Book issued successfully',
      loan: savedLoan,
    });
  } catch (err) {
    console.error('Error issuing book:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getActiveLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ returnDate: null }).populate('studentId', 'name email studentId');

    // Manually fetch book details
    const enrichedLoans = await Promise.all(
      loans.map(async (loan) => {
        const book = await Book.findOne({ bid: loan.bid });
        return {
          ...loan.toObject(),
          bookTitle: book ? book.title : 'Unknown Book',
        };
      })
    );

    res.status(200).json({ loans: enrichedLoans });
  } catch (err) {
    console.error('Error fetching active loans:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

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

    const book = await Book.findOne({ bid: loan.bid });
    if (book) {
      book.status = 'available';
      await book.save();
    }

    res.status(200).json({ message: 'Book returned successfully', record: updatedLoan });
  } catch (err) {
    console.error('Error returning book:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getRecentActivities, issueBook, getActiveLoans, returnBook };