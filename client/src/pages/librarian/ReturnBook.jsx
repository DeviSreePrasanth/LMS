import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ReturnBook = ({ setActiveSection }) => {
  const [students, setStudents] = useState([]);
  const [activeLoans, setActiveLoans] = useState({ loans: [], issuedBooks: [] });
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    bookTitle: '',
    issuedBookId: '',
    type: '',
    returnDate: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to continue');
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        const studentsResponse = await axios.get('http://localhost:5000/api/students', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(studentsResponse.data);

        const activeLoansResponse = await axios.get('http://localhost:5000/api/loans/active', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActiveLoans({
          loans: activeLoansResponse.data.loans || [],
          issuedBooks: activeLoansResponse.data.issuedBooks || [],
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch students or active loans');
        console.error('Fetch error:', err);
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (formData.studentId) {
      const booksForStudent = [
        ...activeLoans.loans.filter((loan) => loan.studentId?._id?.toString() === formData.studentId),
        ...activeLoans.issuedBooks.filter((book) => book.studentId?._id?.toString() === formData.studentId),
      ];
      setFilteredBooks(booksForStudent);
      if (!booksForStudent.some((book) => book._id === formData.issuedBookId)) {
        setFormData((prev) => ({ ...prev, bookTitle: '', issuedBookId: '', type: '' }));
      }
    } else {
      setFilteredBooks([]);
    }
  }, [formData.studentId, activeLoans]);

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
        type: selectedBook ? (activeLoans.loans.some((l) => l._id === selectedBook._id) ? 'loan' : 'issuedBook') : '',
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to continue');
      }

      const response = await axios.put(
        `http://localhost:5000/api/loans/return/${formData.issuedBookId}`,
        submitData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(`Book returned successfully from ${formData.studentName || 'student'}!`);
      setFormData({
        studentName: '',
        studentId: '',
        bookTitle: '',
        issuedBookId: '',
        type: '',
        returnDate: new Date().toISOString().split('T')[0],
      });

      const updatedResponse = await axios.get('http://localhost:5000/api/loans/active', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActiveLoans({
        loans: updatedResponse.data.loans || [],
        issuedBooks: updatedResponse.data.issuedBooks || [],
      });

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
      className="p-4 sm:p-6 bg-[#f4f7fa] min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-[#2c3e50]">Return Book</h2>

        {error && <p className="text-red-500 text-center mb-4 text-sm sm:text-base">{error}</p>}
        {success && <p className="text-[#1abc9c] text-center mb-4 text-sm sm:text-base">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="studentName" className="block text-[#7f8c8d] text-sm sm:text-base font-medium mb-2">
              Student Name
            </label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              list="studentsList"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa] text-sm sm:text-base"
              placeholder="Type student name"
              required
            />
            <datalist id="studentsList">
              {students.map((student) => (
                <option key={student._id} value={student.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="bookTitle" className="block text-[#7f8c8d] text-sm sm:text-base font-medium mb-2">
              Book Title
            </label>
            <input
              type="text"
              id="bookTitle"
              name="bookTitle"
              value={formData.bookTitle}
              onChange={handleChange}
              list="issuedBooksList"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa] text-sm sm:text-base"
              placeholder="Type book title"
              required
              disabled={!formData.studentId}
            />
            <datalist id="issuedBooksList">
              {filteredBooks.map((book) => (
                <option key={book._id} value={book.title} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="returnDate" className="block text-[#7f8c8d] text-sm sm:text-base font-medium mb-2">
              Return Date
            </label>
            <input
              type="date"
              id="returnDate"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa] text-sm sm:text-base"
              required
            />
          </div>

          <motion.button
            type="submit"
            className={`w-full bg-[#059669] hover:bg-[#047857] text-white p-2 sm:p-3 rounded-md transition duration-200 text-sm sm:text-base ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            disabled={loading}
          >
            {loading ? 'Returning...' : 'Return Book'}
          </motion.button>

          <motion.button
            onClick={() => setActiveSection('students')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-[#2c3e50] p-2 sm:p-3 rounded-md transition duration-200 text-sm sm:text-base"
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