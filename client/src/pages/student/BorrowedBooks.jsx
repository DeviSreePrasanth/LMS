import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const BorrowedBooks = () => {
  const { user } = useContext(AuthContext);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user || !user.email) {
        setError('User not authenticated or email missing');
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const studentResponse = await axios.get(`https://lms-o44p.onrender.com/api/students/email/${user.email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const student = studentResponse.data;

        const loansResponse = await axios.get(`https://lms-o44p.onrender.com/api/loans?studentId=${student._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allBooks = loansResponse.data;

        const borrowedBooks = allBooks.filter((book) => !book.returnDate);
        const returnedBooks = allBooks.filter((book) => book.returnDate);

        setStudentData({ ...student, borrowedBooks, returnedBooks });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch student data');
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [user]);

  const calculateFine = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const overdueDays = Math.max(
      0,
      Math.floor((today - due) / (1000 * 60 * 60 * 24))
    );
    const finePerDay = 5;
    return overdueDays > 0 ? overdueDays * finePerDay : 0;
  };

  const palette = {
    primary: '#2c3e50',
    accent: '#1abc9c',
    warning: '#e74c3c',
    muted: '#7f8c8d',
    bg: '#f4f7fa',
  };
  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg sm:text-xl" style={{ color: palette.primary }}>
            Loading your details...
          </p>
        </motion.div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex-1 p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg sm:text-xl" style={{ color: palette.warning }}>
            Error: {error}
          </p>
        </motion.div>
      </div>
    );
  }
  return (
    <motion.div
      className="flex-1 p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {studentData && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-xl sm:text-2xl font-bold text-[#2c3e50] mb-4">Your Details</h3>
          <div className="mb-4 text-sm sm:text-base">
            <p>
              <strong>Name:</strong> {studentData.name}
            </p>
            <p>
              <strong>Student ID:</strong> {studentData.studentId}
            </p>
            <p>
              <strong>Email:</strong> {studentData.email}
            </p>
          </div>

          <h4 className="text-lg sm:text-xl font-semibold text-[#2c3e50] mb-2">Currently Borrowed Books</h4>
          <AnimatePresence>
            {studentData.borrowedBooks.length > 0 ? (
              <div className="overflow-x-auto mb-6 sm:mb-8">
                <table className="min-w-full border-collapse bg-gray-50 rounded-lg">
                  <thead className="bg-[#1f2937] text-white">
                    <tr>
                      <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">Book ID</th>
                      <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">Title</th>
                      <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">Issued</th>
                      <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">Due</th>
                      <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">Status</th>
                      <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.borrowedBooks.map((book) => {
                      const fine = calculateFine(book.dueDate);
                      const isOverdue = new Date(book.dueDate) < new Date();
                      return (
                        <motion.tr
                          key={book._id}
                          className="border-b border-gray-200"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">{book.bid}</td>
                          <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">{book.title}</td>
                          <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">{new Date(book.issueDate).toLocaleDateString()}</td>
                          <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">{new Date(book.dueDate).toLocaleDateString()}</td>
                          <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">
                            {isOverdue ? (
                              <span className="text-red-500">Overdue</span>
                            ) : (
                              <span className="text-[#1abc9c]">Active</span>
                            )}
                          </td>
                          <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">{fine > 0 ? `$${fine}` : '-'}</td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-[#7f8c8d] text-sm sm:text-base mb-6 sm:mb-8">No books currently borrowed</p>
            )}
          </AnimatePresence>

          <h4 className="text-lg sm:text-xl font-semibold text-[#2c3e50] mb-2">Returned Books</h4>
          <AnimatePresence>
            {studentData.returnedBooks.length > 0 ? (
              <ul className="list-disc list-inside text-sm sm:text-base">
                {studentData.returnedBooks.map((book) => (
                  <motion.li
                    key={book._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <strong>{book.title}</strong> - Returned on {new Date(book.returnDate).toLocaleDateString()}
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-[#7f8c8d] text-sm sm:text-base">No books have been returned yet</p>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default BorrowedBooks;