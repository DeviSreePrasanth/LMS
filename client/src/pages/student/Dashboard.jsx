import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import StudentBookList from '../student/BookList';
import BorrowedBooks from '../student/BorrowedBooks';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';

const Sidebar = ({ setActiveSection, activeSection, handleLogout }) => {
  const menuItems = [
    { name: 'Dashboard', section: 'dashboard' },
    { name: 'Book List', section: 'booklist' },
    { name: 'Borrowed Books', section: 'studentdetails' },
  ];

  return (
    <motion.div
      className="w-[250px] bg-[#2c3e50] text-white p-5 fixed h-full flex flex-col justify-between"
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div>
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
      </div>
      <motion.button
        className="w-full p-3 bg-[#e74c3c] hover:bg-[#c0392b] rounded-md flex items-center justify-center space-x-2"
        onClick={handleLogout}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <BiLogOut size={20} />
        <span>Logout</span>
      </motion.button>
    </motion.div>
  );
};

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

const StudentDashboard = () => {
  const { user, logout, loading: authLoading, error: authError } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [statsData, setStatsData] = useState([
    { title: 'Total Books', value: '1,245' },
    { title: 'My Loans', value: '0' },
    { title: 'Overdue', value: '0' },
  ]);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStudentAccess = async () => {
      if (authLoading) return; // Wait for auth context to resolve

      if (!user || !user.email || user.role !== 'student') {
        console.log('No user, email, or incorrect role');
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/students/email/${user.email}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Student verification response:', response.data);

        if (response.data && response.data.email === user.email) {
          setIsAuthorized(true);

          const loansResponse = await axios.get(`http://localhost:5000/api/loans?studentId=${response.data._id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const borrowedBooks = loansResponse.data;
          const activeLoans = borrowedBooks.filter((book) => !book.returnDate).length;
          const overdueLoans = borrowedBooks.filter(
            (book) => !book.returnDate && new Date(book.dueDate) < new Date()
          ).length;

          setStatsData([
            { title: 'Total Books', value: '1,245' },
            { title: 'My Loans', value: activeLoans.toString() },
            { title: 'Overdue', value: overdueLoans.toString() },
          ]);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        console.error('Authorization error:', err.response?.data || err.message);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkStudentAccess();
  }, [user, authLoading]);

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page on logout
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa]">
        <p className="text-[#2c3e50] text-xl">Loading...</p>
      </div>
    );
  }

  if (isAuthorized === false) {
    // Only navigate to /unauthorized if there's an actual error after refresh attempt
    if (authError) {
      navigate('/unauthorized');
      return null;
    }
    // Otherwise, keep the dashboard visible until explicitly logged out
    return (
      <div className="flex min-h-screen bg-[#f4f7fa]">
        <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} handleLogout={handleLogout} />
        <div className="flex-1 ml-[250px] p-8">
          <Header />
          <p className="text-red-500 text-xl text-center mt-8">
            Authentication issue detected. Please log out and log in again.
          </p>
        </div>
      </div>
    );
  }

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
          </>
        );
      case 'booklist':
        return <StudentBookList />;
      case 'studentdetails':
        return <BorrowedBooks />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7fa]">
      <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} handleLogout={handleLogout} />
      <div className="flex-1 ml-[250px] p-8">
        <Header />
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboard;