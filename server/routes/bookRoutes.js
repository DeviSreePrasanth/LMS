const express = require('express');
const router = express.Router();
const { addBook, getBooks, updateBook, deleteBook } = require('../controllers/bookController');

// Route to get all books
router.get('/', getBooks);

// Route to add a book
router.post('/', addBook);

// Route to update a book
router.put('/:id', updateBook);

// Route to delete a book
router.delete('/:id', deleteBook);

module.exports = router;
