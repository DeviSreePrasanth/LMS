const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Add a new book
router.post('/', async (req, res) => {
  const { title, author, genre, publishedYear, available } = req.body;

  try {
    const existingBook = await Book.findOne({ title, author });
    if (existingBook) {
      return res.status(409).json({ message: 'Book already exists' });
    }

    const newBook = new Book({ title, author, genre, publishedYear, available });
    const savedBook = await newBook.save();

    res.status(201).json({ message: 'Book added successfully', book: savedBook });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
// Search books by title or author
router.get('/search', async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  try {
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } }, // Case insensitive search on title
        { author: { $regex: query, $options: 'i' } }, // Case insensitive search on author
      ],
    });

    if (books.length === 0) {
      return res.status(404).json({ message: 'No books found' });
    }

    res.status(200).json(books);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a book
router.put('/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
