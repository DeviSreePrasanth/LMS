const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

router.post('/add', async (req, res) => {
  try {
    const { title, author, studentName, transactionDate } = req.body;

    // Validate input
    if (!title || !author || !studentName || !transactionDate) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the book exists in the Book collection
    const existingBook = await Book.findOne({
      title: { $regex: new RegExp(`^${title.trim()}$`, 'i') },
      author: { $regex: new RegExp(`^${author.trim()}$`, 'i') },
    });

    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found in the library.' });
    }

    // Check if the book is available (i.e., not already issued)
    if (!existingBook.available) {
      return res.status(400).json({ message: 'Book is not available for issue.' });
    }

    // Create a new transaction
    const newTransaction = new Transaction({
      title: title.trim(),
      author: author.trim(),
      studentName: studentName.trim(),
      transactionDate,
    });

    // Save the transaction
    await newTransaction.save();

    // Update the availability of the book to false (i.e., book is now issued)
    const updatedBook = await Book.updateOne(
      { _id: existingBook._id }, // Use the book's _id for a more specific update
      { $set: { available: false } } // Set availability to false
    );

    // Check if the update was successful
    if (!updatedBook) {
      return res.status(500).json({ message: 'Error updating book availability.' });
    }

    res.status(201).json({ message: 'Transaction added and book availability updated successfully!' });
  } catch (err) {
    console.error('Error adding transaction:', err.message);
    res.status(500).json({ message: 'Error adding transaction.', error: err.message });
  }
});

module.exports = router;
