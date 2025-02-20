import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const StudentBookList = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
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

  // Student-specific color palette
  const palette = {
    primary: '#1e3a8a', // Deep blue for headers and text
    accent: '#f97316',  // Orange for highlights
    muted: '#6b7280',   // Muted gray for secondary text
    bg: '#f9fafb',      // Light gray background
    headerBg: '#1e3a8a', // Deep blue for table header
  };

  return (
    <motion.div
      className="p-6 bg-[#f9fafb]" // Use student palette.bg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <h2 className={`text-3xl font-bold mb-4 text-center text-[#2c3e50]`}>Book List</h2>
      {error && (
        <p className="text-red-500 text-center mb-4">Error: {error}</p>
      )}
      {!books.length ? (
        <p className={`text-center text-[#6b7280]`}>No books available</p> // Use palette.muted
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
              <thead className={`bg-[#1f2937] text-white`}> {/* Use palette.headerBg */}
                <tr>
                  <th className="py-3 px-4 text-left">Book ID</th>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Author</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-center">Status</th>
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
                    <td className="py-2 px-4 text-[#2c3e50]">{book.bid}</td> {/* Use palette.primary */}
                    <td className="py-2 px-4 text-[#2c3e50]">{book.title}</td>
                    <td className="py-2 px-4 text-[#2c3e50]">{book.author}</td>
                    <td className="py-2 px-4 text-[#2c3e50]">{book.category}</td>
                    <td className="py-2 px-4 text-center">
                      <span
                        className={`${
                          book.status === 'available' ? 'text-[#1abc9c]' : 'text-red-500'
                        } font-semibold`}
                      >
                        {book.status}
                      </span>
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

export default StudentBookList;