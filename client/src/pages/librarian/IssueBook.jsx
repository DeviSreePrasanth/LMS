import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const IssueBook = ({ setActiveSection }) => {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    studentName: '', // Display name in frontend
    studentId: '',   // Actual ObjectId for submission
    bookName: '',    // Display name in frontend
    bid: '',         // Actual string ID for submission
    dueDate: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await axios.get('https://lms-o44p.onrender.com/api/students');
        setStudents(studentsResponse.data);

        const booksResponse = await axios.get('https://lms-o44p.onrender.com/api/books');
        setBooks(booksResponse.data);
      } catch (err) {
        setError('Failed to fetch students or books');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'studentName') {
      const selectedStudent = students.find((student) => student.name === value);
      setFormData((prev) => ({
        ...prev,
        studentName: value,
        studentId: selectedStudent ? selectedStudent._id : '', // Use _id for MongoDB ObjectId
      }));
    } else if (name === 'bookName') {
      const selectedBook = books.find((book) => book.title === value);
      setFormData((prev) => ({
        ...prev,
        bookName: value,
        bid: selectedBook ? String(selectedBook.bid) : '', // Ensure bid is a string
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

    // Prepare data for submission (only send studentId, bid, and dueDate)
    const submitData = {
      studentId: formData.studentId, // Should be ObjectId like "67bc2663abe5a32421c57d8f"
      bid: formData.bid,             // Should be string like "16"
      dueDate: formData.dueDate,
    };

    console.log('Submitting issue book data:', submitData);

    try {
      const response = await axios.post('https://lms-o44p.onrender.com/api/loans', submitData);
      setSuccess('Book issued successfully!');
      setFormData({ studentName: '', studentId: '', bookName: '', bid: '', dueDate: '' });
      setTimeout(() => setActiveSection('students'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue book');
      console.error('Error details:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const palette = {
    primary: '#2c3e50',
    accent: '#1abc9c',
    muted: '#7f8c8d',
    bg: '#f4f7fa',
  };

  return (
    <motion.div
      className="p-6 bg-[#f4f7fa] max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#2c3e50]">Issue Book</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-[#1abc9c] text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Name with Autocomplete */}
          <div>
            <label htmlFor="studentName" className="block text-[#7f8c8d] text-sm font-medium mb-2">
              Student Name
            </label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              list="studentsList"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
              placeholder="Type student name"
              required
            />
            <datalist id="studentsList">
              {students.map((student) => (
                <option key={student._id} value={student.name} />
              ))}
            </datalist>
          </div>

          {/* Book Name with Autocomplete */}
          <div>
            <label htmlFor="bookName" className="block text-[#7f8c8d] text-sm font-medium mb-2">
              Book Name
            </label>
            <input
              type="text"
              id="bookName"
              name="bookName"
              value={formData.bookName}
              onChange={handleChange}
              list="booksList"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
              placeholder="Type book name"
              required
            />
            <datalist id="booksList">
              {books.map((book) => (
                <option key={book._id} value={book.title} />
              ))}
            </datalist>
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