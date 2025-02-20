import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [editData, setEditData] = useState({ bid: '', title: '', author: '', category: '', status: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 20;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books');
        // Sort books by bid in ascending order
        const sortedBooks = response.data.sort((a, b) => a.bid - b.bid);
        setBooks(sortedBooks);
      } catch (err) {
        setError(err.response?.data?.msg || err.message || 'Failed to fetch books');
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
    if (!bookId) {
      setError('Invalid book ID for deletion.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this book?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/books/${bookId}`);
      if (response.status !== 200) {
        throw new Error('Failed to delete book');
      }

      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || `Error deleting book: ${err.message}`);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book._id);
    setEditData({
      bid: book.bid,
      title: book.title,
      author: book.author,
      category: book.category,
      status: book.status,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editingBook || !editData) {
      setError('Incomplete edit data.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/books/${editingBook}`,
        editData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to update book');
      }

      const updatedBook = response.data;
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book._id === editingBook ? updatedBook : book))
      );
      setEditingBook(null);
      setEditData({});
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || `Error updating book: ${err.message}`);
    }
  };

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Librarian-specific color palette
  const palette = {
    primary: '#2c3e50', // Dark blue-gray for headers and bold text
    accent: '#1abc9c',  // Teal for highlights
    muted: '#7f8c8d',   // Muted gray for secondary text
    bg: '#f4f7fa',      // Light gray background
    headerBg: '#1f2937', // Darker gray for table header
  };

  return (
    <motion.div
      className="p-6 bg-[#f4f7fa]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <h2 className={`text-3xl font-bold mb-4 text-center text-[#2c3e50]`}>Book List</h2>
      {error && (
        <p className="text-red-500 text-center mb-4">Error: {error}</p>
      )}
      {!books.length ? (
        <p className={`text-center text-[#7f8c8d]`}>No books available</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
              <thead className={`bg-[#1f2937] text-white`}>
                <tr>
                  <th className="py-3 px-4 text-left">Book ID</th>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Author</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBooks.map((book) => (
                  <motion.tr
                    key={book._id}
                    className="hover:bg-gray-100 border-b border-gray-200 transition duration-300 ease-in-out"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: currentBooks.indexOf(book) * 0.1 }}
                  >
                    <td className="py-2 px-4 text-[#2c3e50]">
                      {editingBook === book._id ? (
                        <input
                          type="number"
                          name="bid"
                          value={editData.bid}
                          onChange={handleEditChange}
                          className="border rounded p-1 w-full focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 bg-[#f4f7fa] text-[#2c3e50]"
                          disabled
                        />
                      ) : (
                        book.bid
                      )}
                    </td>
                    <td className="py-2 px-4 text-[#2c3e50]">
                      {editingBook === book._id ? (
                        <input
                          type="text"
                          name="title"
                          value={editData.title}
                          onChange={handleEditChange}
                          className="border rounded p-1 w-full focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 bg-[#f4f7fa] text-[#2c3e50]"
                        />
                      ) : (
                        book.title
                      )}
                    </td>
                    <td className="py-2 px-4 text-[#2c3e50]">
                      {editingBook === book._id ? (
                        <input
                          type="text"
                          name="author"
                          value={editData.author}
                          onChange={handleEditChange}
                          className="border rounded p-1 w-full focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 bg-[#f4f7fa] text-[#2c3e50]"
                        />
                      ) : (
                        book.author
                      )}
                    </td>
                    <td className="py-2 px-4 text-[#2c3e50]">
                      {editingBook === book._id ? (
                        <input
                          type="text"
                          name="category"
                          value={editData.category}
                          onChange={handleEditChange}
                          className="border rounded p-1 w-full focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 bg-[#f4f7fa] text-[#2c3e50]"
                        />
                      ) : (
                        book.category
                      )}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {editingBook === book._id ? (
                        <select
                          name="status"
                          value={editData.status}
                          onChange={handleEditChange}
                          className="border rounded p-1 w-full focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 bg-[#f4f7fa] text-[#2c3e50]"
                        >
                          <option value="available">Available</option>
                          <option value="issued">Issued</option>
                        </select>
                      ) : (
                        <span
                          className={`${
                            book.status === 'available' ? 'text-[#1abc9c]' : 'text-red-500'
                          } font-semibold`}
                        >
                          {book.status}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        {editingBook === book._id ? (
                          <>
                            <motion.button
                              onClick={handleEditSubmit}
                              className="bg-[#059669] hover:bg-[#047857] text-white px-3 py-1 rounded transition duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Save
                            </motion.button>
                            <motion.button
                              onClick={() => setEditingBook(null)}
                              className="bg-[#6b7280] hover:bg-[#4b5563] text-white px-3 py-1 rounded transition duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Cancel
                            </motion.button>
                          </>
                        ) : (
                          <>
                            <motion.button
                              onClick={() => handleEdit(book)}
                              className="bg-[#f59e0b] hover:bg-[#fbbf24] text-white px-3 py-1 rounded transition duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Edit
                            </motion.button>
                            <motion.button
                              onClick={() => handleDelete(book._id)}
                              className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-3 py-1 rounded transition duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Delete
                            </motion.button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 space-x-4">
            <motion.button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md text-white transition duration-200 ${
                currentPage === 1
                  ? 'bg-[#6b7280] cursor-not-allowed'
                  : 'bg-[#1e3a8a] hover:bg-[#1e40af]'
              }`}
              whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
            >
              Previous
            </motion.button>
            <span className="text-[#2c3e50] self-center">
              Page {currentPage} of {totalPages}
            </span>
            <motion.button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md text-white transition duration-200 ${
                currentPage === totalPages
                  ? 'bg-[#6b7280] cursor-not-allowed'
                  : 'bg-[#1e3a8a] hover:bg-[#1e40af]'
              }`}
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
            >
              Next
            </motion.button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default BookList;