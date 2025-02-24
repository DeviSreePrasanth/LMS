import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

const StudentDetails = () => {
  const { user } = useContext(AuthContext);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!user || !user._id) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const studentResponse = await axios.get(`http://localhost:5000/api/students/${user._id}`);
        const student = studentResponse.data;

        const loansResponse = await axios.get(`http://localhost:5000/api/loans?studentId=${user._id}`);
        const borrowedBooks = loansResponse.data;

        setStudentData({ ...student, borrowedBooks });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch student details');
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [user]);

  const calculateFine = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const overdueDays = Math.max(0, Math.floor((today - due) / (1000 * 60 * 60 * 24)));
    const finePerDay = 5;
    return overdueDays > 0 ? overdueDays * finePerDay : 0;
  };

  const palette = {
    primary: '#2c3e50',
    accent: '#1abc9c',
    muted: '#7f8c8d',
    bg: '#f4f7fa',
    headerBg: '#1f2937',
  };

  if (loading) {
    return (
      <motion.div className="p-6 bg-[#f4f7fa] min-h-screen flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <p className="text-[#2c3e50] text-xl">Loading...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div className="p-6 bg-[#f4f7fa] min-h-screen flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <p className="text-red-500 text-xl">Error: {error}</p>
      </motion.div>
    );
  }

  if (!studentData) {
    return (
      <motion.div className="p-6 bg-[#f4f7fa] min-h-screen flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <p className="text-[#7f8c8d] text-xl">No student data available</p>
      </motion.div>
    );
  }

  const totalFines = studentData.borrowedBooks
    .filter((book) => !book.returnDate && new Date(book.dueDate) < new Date())
    .reduce((sum, book) => sum + calculateFine(book.dueDate), 0);

  return (
    <motion.div className="p-6 bg-[#f4f7fa] min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: 'easeInOut' }}>
      <h2 className="text-3xl font-bold mb-6 text-center text-[#2c3e50]">My Details</h2>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h3 className="text-xl font-semibold text-[#2c3e50] mb-3">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Name:</strong> {studentData.name}</p>
            <p><strong>Student ID:</strong> {studentData.studentId}</p>
            <p><strong>Email:</strong> {studentData.email}</p>
            <p><strong>Total Books Borrowed:</strong> {studentData.borrowedBooks.length}</p>
            {totalFines > 0 && (
              <p className="text-red-500"><strong>Total Fines:</strong> ${totalFines}</p>
            )}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-[#2c3e50] mb-4">Borrowed Books</h3>
        {studentData.borrowedBooks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse bg-gray-50 rounded-lg"><thead className="bg-[#1f2937] text-white"><tr><th className="py-2 px-4 text-left">Book ID</th><th className="py-2 px-4 text-left">Title</th><th className="py-2 px-4 text-left">Issue Date</th><th className="py-2 px-4 text-left">Due Date</th><th className="py-2 px-4 text-left">Status</th><th className="py-2 px-4 text-left">Fine</th></tr></thead><tbody>
              {studentData.borrowedBooks.map((book) => {
                const isOverdue = !book.returnDate && new Date(book.dueDate) < new Date();
                const fine = calculateFine(book.dueDate);
                return (
                  <motion.tr key={book._id} className="border-b border-gray-200 hover:bg-gray-100" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <td className="py-2 px-4">{book.bid}</td><td className="py-2 px-4">{book.title}</td><td className="py-2 px-4">{new Date(book.issueDate).toLocaleDateString()}</td><td className="py-2 px-4">{new Date(book.dueDate).toLocaleDateString()}</td><td className="py-2 px-4">{book.returnDate ? (<span className="text-green-500">Returned</span>) : isOverdue ? (<span className="text-red-500">Overdue</span>) : (<span className="text-[#1abc9c]">Active</span>)}</td><td className="py-2 px-4">{fine > 0 ? (<span className="text-red-500">${fine}</span>) : '-'}</td>
                  </motion.tr>
                );
              })}
            </tbody></table>
          </div>
        ) : (
          <p className="text-[#7f8c8d] text-center">You have not borrowed any books yet.</p>
        )}
      </div>
    </motion.div>
  );
};

export default StudentDetails;