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
      [name]: name === 'bid' ? parseInt(value, 10) || '' : value, // Convert bid to number
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
      }); // Reset form
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding book: ' + err.message);
      setSuccess(null);
    }
  };

  // Librarian-specific color palette
  const palette = {
    primary: '#2c3e50', // Dark blue-gray for headers and text
    accent: '#1abc9c',  // Teal for highlights
    muted: '#7f8c8d',   // Muted gray for secondary text
    bg: '#f4f7fa',      // Light gray background
    headerBg: '#1f2937', // Darker gray for headers
  };

  return (
    <motion.div
      className="p-6 bg-[#f4f7fa] max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <h2 className={`text-3xl font-bold mb-6 text-center text-[#2c3e50]`}>Add New Book</h2>
      {error && (
        <p className="text-red-500 text-center mb-4">Error: {error}</p>
      )}
      {success && (
        <p className="text-[#1abc9c] text-center mb-4">{success}</p>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="bid" className="block text-[#7f8c8d] text-sm font-medium mb-2">
            Book ID
          </label>
          <input
            type="number"
            id="bid"
            name="bid"
            value={formData.bid}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
            placeholder="Enter unique BID"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="block text-[#7f8c8d] text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
            placeholder="Enter book title"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="author" className="block text-[#7f8c8d] text-sm font-medium mb-2">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
            placeholder="Enter author name"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-[#7f8c8d] text-sm font-medium mb-2">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
            placeholder="Enter category"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="status" className="block text-[#7f8c8d] text-sm font-medium mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
          >
            <option value="available">Available</option>
            <option value="issued">Issued</option>
          </select>
        </div>
        <motion.button
          type="submit"
          className="w-full bg-[#059669] hover:bg-[#047857] text-white p-3 rounded-md transition duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Book
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddBook;