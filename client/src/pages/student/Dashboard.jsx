import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; // Assuming this provides user data
import StudentBookList from '../student/BookList';

// Sidebar Component
const Sidebar = ({ setActiveSection, activeSection }) => {
  const menuItems = [
    { name: 'Dashboard', section: 'dashboard' },
    { name: 'Book List', section: 'booklist' },
    { name: 'My Loans', section: 'myloans' },
  ];

  return (
    <motion.div
      className="w-[250px] bg-[#2c3e50] text-white p-5 fixed h-full"
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <h2 className="text-2xl font-semibold mb-8 text-center">Student Portal</h2>
      <ul className="space-y-3">
        {menuItems.map((item, index) => (
          <motion.li
            key={index}
            className={`p-3 rounded-md cursor-pointer hover:bg-[#1abc9c] transition-transform duration-300 ${
              activeSection === item.section ? 'bg-[#1abc9c]' : 'bg-[#34495e]'
            }`}
            whileHover={{ x: 10 }}
            onClick={() => setActiveSection(item.section)}
          >
            {item.name}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

// Header Component with Profile Image Upload
const Header = () => {
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem('studentProfileImage') || 'https://via.placeholder.com/40'
  );
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfileImage(imageData);
        localStorage.setItem('studentProfileImage', imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <motion.div
      className="flex justify-between items-center bg-white p-5 rounded-lg shadow-md relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <h1 className="text-2xl font-bold text-[#2c3e50]">Student Dashboard</h1>
      <div className="flex items-center space-x-3">
        <span className="text-gray-600">Welcome, Student</span>
        <div className="relative">
          <motion.img
            src={profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onClick={triggerFileUpload}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>
    </motion.div>
  );
};

// StatsCard Component
const StatsCard = ({ title, value }) => (
  <motion.div
    className="bg-white p-5 rounded-lg shadow-md text-center"
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, ease: 'easeInOut' }}
  >
    <h3 className="text-lg text-[#7f8c8d] mb-2">{title}</h3>
    <p className="text-2xl font-bold text-[#2c3e50]">{value}</p>
  </motion.div>
);

// MyLoans Component (Updated with real data)
const MyLoans = () => {
  const { user } = useContext(AuthContext); // Get authenticated student
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

  if (loading) {
    return <p className="text-[#2c3e50] text-center mt-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">Error: {error}</p>;
  }

  if (!studentData) {
    return <p className="text-[#7f8c8d] text-center mt-8">No data available</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-[#2c3e50] mb-5">My Loans</h2>
      <div className="bg-white p-5 rounded-lg shadow-md">
        {/* Student Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#2c3e50] mb-2">My Information</h3>
          <p><strong>Name:</strong> {studentData.name}</p>
          <p><strong>Student ID:</strong> {studentData.studentId}</p>
          <p><strong>Email:</strong> {studentData.email}</p>
          <p><strong>Total Books Borrowed:</strong> {studentData.borrowedBooks.length}</p>
        </div>

        {/* Borrowed Books */}
        <h3 className="text-lg font-semibold text-[#2c3e50] mb-2">Borrowed Books</h3>
        {studentData.borrowedBooks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f4f7fa] text-[#7f8c8d]">
                  <th className="p-3">Book ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Issue Date</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {studentData.borrowedBooks.map((book, index) => {
                  const isOverdue = !book.returnDate && new Date(book.dueDate) < new Date();
                  return (
                    <motion.tr
                      key={book._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <td className="p-3">{book.bid}</td>
                      <td className="p-3">{book.title}</td>
                      <td className="p-3">{new Date(book.issueDate).toLocaleDateString()}</td>
                      <td className="p-3">{new Date(book.dueDate).toLocaleDateString()}</td>
                      <td className="p-3">
                        {book.returnDate ? (
                          <span className="text-green-500">Returned</span>
                        ) : isOverdue ? (
                          <span className="text-red-500">Overdue</span>
                        ) : (
                          <span className="text-[#1abc9c]">Borrowed</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[#7f8c8d]">You have not borrowed any books yet.</p>
        )}
      </div>
    </div>
  );
};

// Main Student Dashboard Component
const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user } = useContext(AuthContext); // Get authenticated student
  const [statsData, setStatsData] = useState([
    { title: 'Total Books', value: '1,245' }, // Static for now
    { title: 'My Loans', value: '0' },
    { title: 'Overdue', value: '0' },
  ]);

  // Fetch stats data when dashboard loads
  useEffect(() => {
    const fetchStats = async () => {
      if (!user || !user._id) return;

      try {
        const loansResponse = await axios.get(`http://localhost:5000/api/loans?studentId=${user._id}`);
        const borrowedBooks = loansResponse.data;
        const activeLoans = borrowedBooks.filter((book) => !book.returnDate).length;
        const overdueLoans = borrowedBooks.filter(
          (book) => !book.returnDate && new Date(book.dueDate) < new Date()
        ).length;

        setStatsData([
          { title: 'Total Books', value: '1,245' }, // Update this dynamically if you have an API for total books
          { title: 'My Loans', value: activeLoans.toString() },
          { title: 'Overdue', value: overdueLoans.toString() },
        ]);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    fetchStats();
  }, [user]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
              {statsData.map((stat, index) => (
                <StatsCard key={index} title={stat.title} value={stat.value} />
              ))}
            </div>
            <MyLoans />
          </>
        );
      case 'booklist':
        return <StudentBookList />;
      case 'myloans':
        return <MyLoans />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7fa]">
      {/* Sidebar */}
      <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />

      {/* Main Content */}
      <div className="flex-1 ml-[250px] p-8">
        <Header />
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboard;