const Loan = require('../models/Loan');
const IssuedBook = require('../models/IssuedBook');
const User = require('../models/User');
const Book = require('../models/Book');

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
    const existingIssuedBook = await IssuedBook.findOne({ bid, returnDate: null });
    if (existingLoan || existingIssuedBook) {
      return res.status(400).json({ message: 'Book is already issued' });
    }

    const loan = new Loan({ studentId, bid, title, dueDate });
    const savedLoan = await loan.save();

    const issuedBook = new IssuedBook({ studentId, bid, title, dueDate });
    const savedIssuedBook = await issuedBook.save();

    res.status(201).json({
      message: 'Book issued successfully',
      loan: savedLoan,
      issuedBook: savedIssuedBook,
    });
  } catch (err) {
    console.error('Error issuing book:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all active loans
const getActiveLoans = async (req, res) => {
  try {
    // Debug: Log the ref values
    console.log('Loan Model Ref:', Loan.schema.paths.studentId.options.ref);
    console.log('IssuedBook Model Ref:', IssuedBook.schema.paths.studentId.options.ref);

    const loans = await Loan.find({ returnDate: null })
      .populate('studentId', 'name email studentId')
      .lean();
    const issuedBooks = await IssuedBook.find({ returnDate: null })
      .populate('studentId', 'name email studentId')
      .lean();

    res.status(200).json({
      loans,
      issuedBooks,
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
    let loan = await Loan.findById(id);
    let issuedBook = null;

    if (!loan) {
      issuedBook = await IssuedBook.findById(id);
      if (!issuedBook) {
        return res.status(404).json({ message: 'Loan or issued book record not found' });
      }
    }

    const record = loan || issuedBook;

    if (record.returnDate) {
      return res.status(400).json({ message: 'Book already returned' });
    }

    record.returnDate = returnDate || new Date();
    const updatedRecord = await record.save();

    if (loan) {
      const relatedIssuedBook = await IssuedBook.findOne({ bid: record.bid, returnDate: null });
      if (relatedIssuedBook) {
        relatedIssuedBook.returnDate = record.returnDate;
        await relatedIssuedBook.save();
      }
    } else if (issuedBook) {
      const relatedLoan = await Loan.findOne({ bid: record.bid, returnDate: null });
      if (relatedLoan) {
        relatedLoan.returnDate = record.returnDate;
        await relatedLoan.save();
      }
    }

    res.status(200).json({ message: 'Book returned successfully', record: updatedRecord });
  } catch (err) {
    console.error('Error returning book:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { issueBook, getActiveLoans, returnBook };