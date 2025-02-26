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
  const booksPerPage = 20;

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

  // Filtering logic
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

  // Pagination logic
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

  // Unique categories for filter dropdown
  const uniqueCategories = [...new Set(books.map((book) => book.category.toLowerCase()))];

  // Color palette matching BookList
  const palette = {
    primary: '#2c3e50',
    accent: '#1abc9c',
    muted: '#7f8c8d',
    bg: '#f4f7fa',
    headerBg: '#1f2937',
  };

  return (
    <motion.div
      className={`p-6 bg-[${palette.bg}]`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <h2 className={`text-3xl font-bold mb-4 text-center text-[${palette.primary}]`}>Book List</h2>
      {error && (
        <p className="text-red-500 text-center mb-4">Error: {error}</p>
      )}

      {/* Search Input */}
      <div className="mb-6 max-w-md mx-auto relative">
        <label htmlFor="search" className={`block text-[${palette.muted}] text-sm font-medium mb-2`}>
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
            className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[${palette.accent}] focus:border-[${palette.accent}] transition duration-200 bg-white text-[${palette.primary}] hover:border-[${palette.accent}]`}
          />
          <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-[${palette.muted}] hover:text-[${palette.accent}] transition duration-200`} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className={`bg-[${palette.headerBg}] text-white`}>
            <tr>
              <th className="py-3 px-4 text-left">Book ID</th>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Author</th>
              <th className="py-3 px-4 text-left">
                Category
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className={`block w-full mt-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[${palette.accent}] transition duration-200 bg-[${palette.bg}] text-[${palette.primary}]`}
                >
                  <option value="">All</option>
                  {uniqueCategories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </th>
              <th className="py-3 px-4 text-center">
                Status
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className={`block w-full mt-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[${palette.accent}] transition duration-200 bg-[${palette.bg}] text-[${palette.primary}]`}
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
                <td colSpan="5" className={`py-4 text-center text-[${palette.muted}]`}>
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
                  <td className={`py-2 px-4 text-[${palette.primary}]`}>{book.bid}</td>
                  <td className={`py-2 px-4 text-[${palette.primary}]`}>{book.title}</td>
                  <td className={`py-2 px-4 text-[${palette.primary}]`}>{book.author}</td>
                  <td className={`py-2 px-4 text-[${palette.primary}]`}>{book.category}</td>
                  <td className="py-2 px-4 text-center">
                    <span
                      className={`${
                        book.status === 'available' ? `text-[${palette.accent}]` : 'text-red-500'
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
        <div className="flex justify-center mt-4 space-x-4">
          <motion.button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md text-white transition duration-200 ${
              currentPage === 1
                ? `bg-[${palette.muted}] cursor-not-allowed`
                : `bg-[${palette.primary}] hover:bg-[#34495e]`
            }`}
            whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
          >
            Previous
          </motion.button>
          <span className={`text-[${palette.primary}] self-center`}>
            Page {currentPage} of {totalPages}
          </span>
          <motion.button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md text-white transition duration-200 ${
              currentPage === totalPages
                ? `bg-[${palette.muted}] cursor-not-allowed`
                : `bg-[${palette.primary}] hover:bg-[#34495e]`
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