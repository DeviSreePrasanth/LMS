import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const IssueBook = ({ setActiveSection }) => {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    bid: '',
    title: '',
    dueDate: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await axios.get('http://localhost:5000/api/students');
        setStudents(studentsResponse.data);

        const booksResponse = await axios.get('http://localhost:5000/api/books');
        setBooks(booksResponse.data);
      } catch (err) {
        setError('Failed to fetch students or books');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'bid') {
      const selectedBook = books.find((book) => book.bid === value);
      setFormData((prev) => ({
        ...prev,
        bid: value,
        title: selectedBook ? selectedBook.title : '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    console.log('Submitting issue book data:', formData);

    try {
      const response = await axios.post('http://localhost:5000/api/loans', formData);
      setSuccess('Book issued successfully!');
      setFormData({ studentId: '', bid: '', title: '', dueDate: '' });
      setTimeout(() => setActiveSection('students'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue book');
    } finally {
      setLoading(false);
    }
  };

  // Librarian-specific color palette (matching AddBook)
  const palette = {
    primary: '#2c3e50', // Dark blue-gray for headers and text
    accent: '#1abc9c',  // Teal for highlights
    muted: '#7f8c8d',   // Muted gray for secondary text
    bg: '#f4f7fa',      // Light gray background
  };

  return (
    <motion.div
      className="p-6 bg-[#f4f7fa] max-w-lg mx-auto" // Adjusted to match AddBook: reduced distance from top
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#2c3e50]">Issue Book</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-[#1abc9c] text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Selection */}
          <div>
            <label htmlFor="studentId" className="block text-[#7f8c8d] text-sm font-medium mb-2">
              Select Student
            </label>
            <select
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
              required
            >
              <option value="">-- Select a student --</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.studentId})
                </option>
              ))}
            </select>
          </div>

          {/* Book Selection */}
          <div>
            <label htmlFor="bid" className="block text-[#7f8c8d] text-sm font-medium mb-2">
              Select Book
            </label>
            <select
              id="bid"
              name="bid"
              value={formData.bid}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
              required
            >
              <option value="">-- Select a book --</option>
              {books.map((book) => (
                <option key={book._id} value={book.bid}>
                  {book.title} (ID: {book.bid})
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="block text-[#7f8c8d] text-sm font-medium mb-2">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
              required
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className={`w-full bg-[#059669] hover:bg-[#047857] text-white p-3 rounded-md transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            disabled={loading}
          >
            {loading ? 'Issuing...' : 'Issue Book'}
          </motion.button>

          {/* Back Button */}
          <motion.button
            onClick={() => setActiveSection('students')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-[#2c3e50] p-3 rounded-md transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Students
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default IssueBook;