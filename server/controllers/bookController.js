const Book = require('../models/Book');
const Loan = require('../models/Loan');

const getTopBorrowedBooks = async (req, res) => {
  try {
    const topBooks = await Loan.aggregate([
      { $group: { _id: '$bid', borrowCount: { $sum: 1 } } }, // Group by bid (Number)
      { $sort: { borrowCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'books', // Ensure this matches your MongoDB collection name
          localField: '_id',
          foreignField: 'bid', // Match Loan.bid with Book.bid
          as: 'book',
        },
      },
      { $unwind: '$book' },
      { $project: { title: '$book.title', borrowCount: 1 } },
    ]);

    res.json(topBooks.length ? topBooks : []);
  } catch (error) {
    console.error('Error fetching top borrowed books:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addBook = async (req, res) => {
  const { bid, title, author, category, status } = req.body;

  if (!bid || !title || !author || !category) {
    return res.status(400).json({ message: 'All fields (bid, title, author, category) are required' });
  }

  try {
    const existingBook = await Book.findOne({ bid });
    if (existingBook) {
      return res.status(409).json({ message: 'Book with this BID already exists' });
    }

    const newBook = new Book({
      bid,
      title,
      author,
      category,
      status: status || 'available',
    });
    const savedBook = await newBook.save();

    res.status(201).json({ message: 'Book added successfully', book: savedBook });
  } catch (error) {
    console.error('Error adding book:', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const updateBook = async (req, res) => {
  const { bid, title, author, category, status } = req.body;

  try {
    if (bid) {
      const existingBook = await Book.findOne({ bid });
      if (existingBook && existingBook._id.toString() !== req.params.id) {
        return res.status(409).json({ message: 'Another book with this BID already exists' });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { bid, title, author, category, status },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error.stack);
    res.status(400).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error.stack);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTopBorrowedBooks, addBook, getBooks, updateBook, deleteBook };