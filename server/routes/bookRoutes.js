const express = require('express');
const router = express.Router();
const { addBook, getBooks, updateBook, deleteBook } = require('../controllers/bookController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Route to get all books (accessible by students and librarians)
router.get('/', authMiddleware, getBooks);

// Route to add a book (only accessible by librarians)
router.post('/', authMiddleware, roleMiddleware(['librarian']), addBook);

// Route to update a book (only accessible by librarians)
router.put('/:id', authMiddleware, roleMiddleware(['librarian']), updateBook);

// Route to delete a book (only accessible by librarians)
router.delete('/:id', authMiddleware, roleMiddleware(['librarian']), deleteBook);

module.exports = router;
