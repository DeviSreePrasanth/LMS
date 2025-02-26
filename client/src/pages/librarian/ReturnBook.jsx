import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const ReturnBook = ({ setActiveSection }) => {
  const [students, setStudents] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [formData, setFormData] = useState({
    studentName: '',      // Display name in frontend
    studentId: '',        // Actual ObjectId for filtering
    bookTitle: '',        // Display title in frontend
    issuedBookId: '',     // Actual loan ID for submission
    returnDate: new Date().toISOString().split('T')[0], // Default to today
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch students and active issued books on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await axios.get('https://lms-o44p.onrender.com/api/students');
        setStudents(studentsResponse.data);

        const issuedBooksResponse = await axios.get('https://lms-o44p.onrender.com/api/loans/active');
        const activeIssuedBooks = issuedBooksResponse.data.issuedBooks || [];
        setIssuedBooks(activeIssuedBooks);
      } catch (err) {
        setError('Failed to fetch students or active issued books');
        console.error('Fetch error:', err);
      }
    };
    fetchData();
  }, []);

  // Filter issued books based on selected student
  useEffect(() => {
    if (formData.studentId) {
      const booksForStudent = issuedBooks.filter(
        (book) => book.studentId._id.toString() === formData.studentId
      );
      setFilteredBooks(booksForStudent);
      if (!booksForStudent.some((book) => book._id === formData.issuedBookId)) {
        setFormData((prev) => ({ ...prev, bookTitle: '', issuedBookId: '' }));
      }
    } else {
      setFilteredBooks([]);
    }
  }, [formData.studentId, issuedBooks]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'studentName') {
      const selectedStudent = students.find((student) => student.name === value);
      setFormData((prev) => ({
        ...prev,
        studentName: value,
        studentId: selectedStudent ? selectedStudent._id : '',
      }));
    } else if (name === 'bookTitle') {
      const selectedBook = filteredBooks.find((book) => book.title === value);
      setFormData((prev) => ({
        ...prev,
        bookTitle: value,
        issuedBookId: selectedBook ? selectedBook._id : '',
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

    const submitData = {
      returnDate: formData.returnDate,
    };

    try {
      const response = await axios.put(
        `https://lms-o44p.onrender.com/api/loans/return/${formData.issuedBookId}`,
        submitData
      );
      setSuccess(`Book returned successfully from ${formData.studentName || 'student'}!`);
      setFormData({
        studentName: '',
        studentId: '',
        bookTitle: '',
        issuedBookId: '',
        returnDate: new Date().toISOString().split('T')[0],
      });

      const updatedResponse = await axios.get('https://lms-o44p.onrender.com/api/loans/active');
      const activeIssuedBooks = updatedResponse.data.issuedBooks || [];
      setIssuedBooks(activeIssuedBooks);

      setTimeout(() => setActiveSection('students'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book');
      console.error('Return error:', err.response?.data);
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
        <h2 className="text-3xl font-bold mb-6 text-center text-[#2c3e50]">Return Book</h2>

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

          {/* Issued Book Title with Autocomplete */}
          <div>
            <label htmlFor="bookTitle" className="block text-[#7f8c8d] text-sm font-medium mb-2">
              Book Title
            </label>
            <input
              type="text"
              id="bookTitle"
              name="bookTitle"
              value={formData.bookTitle}
              onChange={handleChange}
              list="issuedBooksList"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
              placeholder="Type book title"
              required
              disabled={!formData.studentId}
            />
            <datalist id="issuedBooksList">
              {filteredBooks.map((issuedBook) => (
                <option key={issuedBook._id} value={issuedBook.title} />
              ))}
            </datalist>
          </div>

          {/* Return Date */}
          <div>
            <label htmlFor="returnDate" className="block text-[#7f8c8d] text-sm font-medium mb-2">
              Return Date
            </label>
            <input
              type="date"
              id="returnDate"
              name="returnDate"
              value={formData.returnDate}
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
            {loading ? 'Returning...' : 'Return Book'}
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

export default ReturnBook;