const Book = require('../models/Book');

// Get all books
const getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Add a book
const addBook = async (req, res) => {
    const { title, author, isbn } = req.body;

    try {
        const newBook = new Book({
            title,
            author,
            isbn
        });

        await newBook.save();
        res.json(newBook);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update a book
const updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, isbn } = req.body;

    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        book.title = title || book.title;
        book.author = author || book.author;
        book.isbn = isbn || book.isbn;

        await book.save();
        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a book
const deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        await book.remove();
        res.json({ msg: 'Book removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { getBooks, addBook, updateBook, deleteBook };
