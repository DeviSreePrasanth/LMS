import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

const StudentBookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ status: '', category: '', search: '' });
  const booksPerPage = 10;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books');
        const sortedBooks = response.data.sort((a, b) => a.bid - b.bid);
        setBooks(sortedBooks);
        setFilteredBooks(sortedBooks);
      } catch (err) {
        setError(err.response?.data?.msg || err.message || 'Failed to fetch books');
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let result = [...books];
      if (filters.status) {
        result = result.filter((book) => book.status === filters.status);
      }
      if (filters.category) {
        result = result.filter((book) => book.category.toLowerCase() === filters.category.toLowerCase());
      }
      if (filters.search) {
        result = result.filter((book) =>
          book.title.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      setFilteredBooks(result);
      setCurrentPage(1);
    };

    applyFilters();
  }, [filters, books]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const uniqueCategories = [...new Set(books.map((book) => book.category.toLowerCase()))];

  const palette = {
    primary: '#2c3e50',
    accent: '#1abc9c',
    muted: '#7f8c8d',
    bg: '#f4f7fa',
    headerBg: '#1f2937',
  };

  return (
    <motion.div
      className="p-4 sm:p-6 bg-[#f4f7fa] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-[#2c3e50]">Book List</h2>
      {error && (
        <p className="text-red-500 text-center mb-4 text-sm sm:text-base">Error: {error}</p>
      )}

      {/* Search Input */}
      <div className="mb-6 w-full max-w-md mx-auto relative">
        <label htmlFor="search" className="block text-[#7f8c8d] text-sm sm:text-base font-medium mb-2">
          Search by Title
        </label>
        <div className="relative">
          <input
            type="text"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search books by title..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1abc9c] focus:border-[#1abc9c] transition duration-200 bg-white text-[#2c3e50] hover:border-[#1abc9c] text-sm sm:text-base"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d] hover:text-[#1abc9c] transition duration-200" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-[#1f2937] text-white">
            <tr>
              <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">Book ID</th>
              <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">Title</th>
              <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">Author</th>
              <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">
                Category
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 bg-[#f4f7fa] text-[#2c3e50] text-xs sm:text-sm"
                >
                  <option value="">All</option>
                  {uniqueCategories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </th>
              <th className="py-2 px-3 sm:px-4 text-center text-xs sm:text-sm">
                Status
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 bg-[#f4f7fa] text-[#2c3e50] text-xs sm:text-sm"
                >
                  <option value="">All</option>
                  <option value="available">Available</option>
                  <option value="issued">Issued</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-center text-[#7f8c8d] text-sm sm:text-base">
                  No books match the selected filters or search
                </td>
              </tr>
            ) : (
              currentBooks.map((book) => (
                <motion.tr
                  key={book._id}
                  className="hover:bg-gray-100 border-b border-gray-200 transition duration-300 ease-in-out"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: currentBooks.indexOf(book) * 0.1 }}
                >
                  <td className="py-2 px-3 sm:px-4 text-[#2c3e50] text-xs sm:text-sm">{book.bid}</td>
                  <td className="py-2 px-3 sm:px-4 text-[#2c3e50] text-xs sm:text-sm">{book.title}</td>
                  <td className="py-2 px-3 sm:px-4 text-[#2c3e50] text-xs sm:text-sm">{book.author}</td>
                  <td className="py-2 px-3 sm:px-4 text-[#2c3e50] text-xs sm:text-sm">{book.category}</td>
                  <td className="py-2 px-3 sm:px-4 text-center text-xs sm:text-sm">
                    <span
                      className={`${
                        book.status === 'available' ? 'text-[#1abc9c]' : 'text-red-500'
                      } font-semibold`}
                    >
                      {book.status}
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredBooks.length > 0 && (
        <div className="flex justify-center mt-4 space-x-2 sm:space-x-4">
          <motion.button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-white transition duration-200 text-xs sm:text-sm ${
              currentPage === 1
                ? 'bg-[#7f8c8d] cursor-not-allowed'
                : 'bg-[#2c3e50] hover:bg-[#34495e]'
            }`}
            whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
          >
            Previous
          </motion.button>
          <span className="text-[#2c3e50] self-center text-xs sm:text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <motion.button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-white transition duration-200 text-xs sm:text-sm ${
              currentPage === totalPages
                ? 'bg-[#7f8c8d] cursor-not-allowed'
                : 'bg-[#2c3e50] hover:bg-[#34495e]'
            }`}
            whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
          >
            Next
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default StudentBookList;