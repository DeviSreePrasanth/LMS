const Loan = require('../models/Loan');
const IssuedBook = require('../models/IssuedBook'); // New model for the separate table
const Student = require('../models/Student');
const Book = require('../models/Book');

// Issue a book
const issueBook = async (req, res) => {
  const { studentId, bid, title: providedTitle, dueDate } = req.body;

  try {
    // Log incoming request for debugging
    console.log('Issuing book with data:', req.body);

    // Validate required fields (excluding title initially)
    if (!studentId || !bid || !dueDate) {
      return res.status(400).json({ message: 'studentId, bid, and dueDate are required' });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if book exists and get its title
    const book = await Book.findOne({ bid });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Use book's title if providedTitle is missing or empty
    const title = providedTitle && providedTitle.trim() ? providedTitle : book.title;
    if (!title) {
      return res.status(400).json({ message: 'Title cannot be determined (provide it or ensure book has a title)' });
    }

    // Check if book is already issued in either collection
    const existingLoan = await Loan.findOne({ bid, returnDate: null });
    const existingIssuedBook = await IssuedBook.findOne({ bid, returnDate: null });
    if (existingLoan || existingIssuedBook) {
      return res.status(400).json({ message: 'Book is already issued' });
    }

    // Create and save the new loan (keeping Loan collection)
    const loan = new Loan({
      studentId,
      bid,
      title,
      dueDate,
    });
    const savedLoan = await loan.save();

    // Save to the new IssuedBook collection as well
    const issuedBook = new IssuedBook({
      studentId,
      bid,
      title,
      dueDate,
    });
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
    const loans = await Loan.find({ returnDate: null })
      .populate('studentId', 'name studentId')
      .lean();
    const issuedBooks = await IssuedBook.find({ returnDate: null })
      .populate('studentId', 'name studentId')
      .lean();

    res.status(200).json({
      loans,
      issuedBooks, // Return both for completeness
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
    // Try Loan collection first
    let loan = await Loan.findById(id);
    let issuedBook = null;

    if (!loan) {
      // If not found in Loan, check IssuedBook
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

    // If it’s a Loan, update IssuedBook too (if exists)
    if (loan) {
      const relatedIssuedBook = await IssuedBook.findOne({ bid: record.bid, returnDate: null });
      if (relatedIssuedBook) {
        relatedIssuedBook.returnDate = record.returnDate;
        await relatedIssuedBook.save();
      }
    } else if (issuedBook) {
      // If it’s an IssuedBook, update Loan too (if exists)
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