import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AddBook = () => {
  const [formData, setFormData] = useState({
    bid: '',
    title: '',
    author: '',
    category: '',
    status: 'available', // Default status
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'bid' ? parseInt(value, 10) || '' : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { bid, title, author, category } = formData;
    if (!bid || !title || !author || !category) {
      setError('All fields (BID, Title, Author, Category) are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/books', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 201) {
        throw new Error('Failed to add book');
      }

      setSuccess('Book added successfully!');
      setError(null);
      setFormData({
        bid: '',
        title: '',
        author: '',
        category: '',
        status: 'available',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding book: ' + err.message);
      setSuccess(null);
    }
  };

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-md sm:max-w-lg mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-[#2c3e50]">Add New Book</h2>
        {error && (
          <p className="text-red-500 text-center mb-4 text-sm sm:text-base">Error: {error}</p>
        )}
        {success && (
          <p className="text-[#1abc9c] text-center mb-4 text-sm sm:text-base">{success}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bid" className="block text-[#7f8c8d] text-sm sm:text-base font-medium mb-2">
              Book ID
            </label>
            <input
              type="number"
              id="bid"
              name="bid"
              value={formData.bid}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa] text-sm sm:text-base"
              placeholder="Enter unique BID"
              required
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-[#7f8c8d] text-sm sm:text-base font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa] text-sm sm:text-base"
              placeholder="Enter book title"
              required
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-[#7f8c8d] text-sm sm:text-base font-medium mb-2">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa] text-sm sm:text-base"
              placeholder="Enter author name"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-[#7f8c8d] text-sm sm:text-base font-medium mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa] text-sm sm:text-base"
              placeholder="Enter category"
              required
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-[#7f8c8d] text-sm sm:text-base font-medium mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa] text-sm sm:text-base"
            >
              <option value="available">Available</option>
              <option value="issued">Issued</option>
            </select>
          </div>
          <motion.button
            type="submit"
            className="w-full bg-[#059669] hover:bg-[#047857] text-white p-2 sm:p-3 rounded-md transition duration-200 text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Book
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddBook;