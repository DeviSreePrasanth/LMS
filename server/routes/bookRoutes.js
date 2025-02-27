const express = require('express');
const router = express.Router();
const { addBook, getBooks, updateBook, deleteBook, getTopBorrowedBooks } = require('../controllers/bookController');

// Route to get all books
router.get('/', getBooks);
// Route to add a book
router.post('/', addBook);
// Route to update a book
router.put('/:id', updateBook);
// Route to delete a book
router.delete('/:id', deleteBook);
// Route to get top borrowed books
router.get('/top-borrowed', getTopBorrowedBooks); // GET /api/books/top-borrowed

module.exports = router;