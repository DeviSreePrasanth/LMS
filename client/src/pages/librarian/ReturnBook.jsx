import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const ReturnBook = ({ setActiveSection }) => {
  const [students, setStudents] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    issuedBookId: '',
    returnDate: new Date().toISOString().split('T')[0], // Default to today
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch students and active issued books on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all students
        const studentsResponse = await axios.get('http://localhost:5000/api/students');
        setStudents(studentsResponse.data);

        // Fetch all active issued books
        const issuedBooksResponse = await axios.get('http://localhost:5000/api/loans/active');
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
      // Reset issuedBookId if it’s no longer valid for the new student
      if (!booksForStudent.some((book) => book._id === formData.issuedBookId)) {
        setFormData((prev) => ({ ...prev, issuedBookId: '' }));
      }
    } else {
      setFilteredBooks([]);
    }
  }, [formData.studentId, issuedBooks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/loans/return/${formData.issuedBookId}`,
        { returnDate: formData.returnDate }
      );
      setSuccess(`Book returned successfully from ${students.find(s => s._id === formData.studentId)?.name || 'student'}!`);
      setFormData({
        studentId: '',
        issuedBookId: '',
        returnDate: new Date().toISOString().split('T')[0],
      });

      // Refresh the list of active issued books
      const updatedResponse = await axios.get('http://localhost:5000/api/loans/active');
      const activeIssuedBooks = updatedResponse.data.issuedBooks || [];
      setIssuedBooks(activeIssuedBooks);

      setTimeout(() => setActiveSection('students'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book');
      console.error('Return error:', err);
    } finally {
      setLoading(false);
    }
  };

  const palette = {
    primary: '#2c3e50',
    accent: '#1abc9c',
    bg: '#f4f7fa',
  };

  return (
    <motion.div
      className="p-6 bg-[#f4f7fa] min-h-screen flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#2c3e50]">Return Book</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Selection */}
          <div>
            <label htmlFor="studentId" className="block text-[#2c3e50] font-semibold mb-2">
              Select Student
            </label>
            <select
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c]"
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

          {/* Issued Book Selection */}
          <div>
            <label htmlFor="issuedBookId" className="block text-[#2c3e50] font-semibold mb-2">
              Select Book to Return
            </label>
            <select
              id="issuedBookId"
              name="issuedBookId"
              value={formData.issuedBookId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c]"
              required
              disabled={!formData.studentId} // Disable until student is selected
            >
              <option value="">-- Select an issued book --</option>
              {filteredBooks.map((issuedBook) => (
                <option key={issuedBook._id} value={issuedBook._id}>
                  {issuedBook.title} (Due: {new Date(issuedBook.dueDate).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="returnDate" className="block text-[#2c3e50] font-semibold mb-2">
              Return Date
            </label>
            <input
              type="date"
              id="returnDate"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c]"
              required
            />
          </div>

          <motion.button
            type="submit"
            className={`w-full py-2 rounded-md text-white bg-[#1e3a8a] hover:bg-[#1e40af] transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            disabled={loading}
          >
            {loading ? 'Returning...' : 'Return Book'}
          </motion.button>
        </form>

        <motion.button
          onClick={() => setActiveSection('students')}
          className="w-full mt-4 py-2 rounded-md text-[#2c3e50] bg-gray-200 hover:bg-gray-300 transition duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Students
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ReturnBook;