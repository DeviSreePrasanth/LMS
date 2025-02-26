import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import StudentBookList from '../student/BookList';
import BorrowedBooks from '../student/BorrowedBooks';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import { FaBook, FaClock, FaCalendar, FaBars } from "react-icons/fa";

const Sidebar = ({ setActiveSection, activeSection, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar on mobile

  const menuItems = [
    { name: 'Dashboard', section: 'dashboard', icon: FaBook },
    { name: 'Book List', section: 'booklist', icon: FaCalendar },
    { name: 'Borrowed Books', section: 'studentdetails', icon: FaClock },
  ];

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <motion.div
        className="md:hidden p-4 bg-[#2c3e50] text-white fixed top-0 left-0 w-full z-20 shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaBars
          className="text-2xl cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </motion.div>

      {/* Sidebar */}
      <motion.div
        className={`w-[250px] bg-[#2c3e50] text-white p-5 fixed h-full flex flex-col justify-between shadow-xl z-10
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}
        initial={{ x: 0 }} // Start at x: 0 for all views
        animate={{ x: isOpen ? 0 : '-100%' }} // Animate only on mobile
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        {...(window.innerWidth >= 768 ? { animate: { x: 0 } } : {})} // Ensure desktop stays fixed
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-8 text-center">Student Portal</h2>
          <ul className="space-y-3">
            {menuItems.map((item, index) => (
              <motion.li
                key={index}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-300 flex items-center gap-3 ${
                  activeSection === item.section ? 'bg-[#1abc9c]' : 'bg-[#34495e] hover:bg-[#1abc9c]'
                }`}
                whileHover={{ x: 10 }}
                onClick={() => {
                  setActiveSection(item.section);
                  setIsOpen(false); // Close sidebar on mobile after selection
                }}
              >
                <item.icon className="text-xl" />
                {item.name}
              </motion.li>
            ))}
          </ul>
        </div>
        <motion.button
          className="w-full p-3 bg-[#e74c3c] hover:bg-[#c0392b] rounded-lg flex items-center justify-center gap-2 shadow-md text-sm sm:text-base"
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BiLogOut size={20} />
          <span>Logout</span>
        </motion.button>
      </motion.div>
    </>
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

  return (
    <motion.div
      className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 sm:p-6 rounded-lg shadow-md mt-16 md:mt-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <h1 className="text-xl sm:text-2xl font-bold text-[#2c3e50] mb-4 sm:mb-0">Student Dashboard</h1>
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="text-[#7f8c8d] font-medium text-sm sm:text-base">Welcome, Student</span>
        <motion.img
          src={profileImage}
          alt="Profile"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full cursor-pointer border-2 border-[#34495e]"
          whileHover={{ scale: 1.1 }}
          onClick={() => fileInputRef.current.click()}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </motion.div>
  );
};

const StatsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, ease: 'easeInOut' }}
  >
    <div className="flex items-center gap-4">
      <Icon className={`text-xl sm:text-2xl ${color}`} />
      <div>
        <p className="text-[#7f8c8d] text-sm sm:text-base">{title}</p>
        <p className="text-xl sm:text-2xl font-bold text-[#2c3e50]">{value}</p>
      </div>
    </div>
  </motion.div>
);

const StudentDashboard = () => {
  const { user, logout, loading: authLoading, error: authError } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [statsData, setStatsData] = useState([
    { title: 'Total Books', value: '0', icon: FaBook, color: 'text-[#1abc9c]' },
    { title: 'My Loans', value: '0', icon: FaCalendar, color: 'text-[#16a085]' },
    { title: 'Overdue', value: '0', icon: FaClock, color: 'text-[#e74c3c]' },
  ]);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (authLoading) return;

      if (!user || !user.email || user.role !== 'student') {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const studentResponse = await axios.get(`http://localhost:5000/api/students/email/${user.email}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (studentResponse.data && studentResponse.data.email === user.email) {
          setIsAuthorized(true);
          const studentId = studentResponse.data._id;

          const booksResponse = await axios.get('http://localhost:5000/api/books', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const totalBooks = booksResponse.data.length;

          const loansResponse = await axios.get(`http://localhost:5000/api/loans?studentId=${studentId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const borrowedBooks = loansResponse.data || [];
          const activeLoans = borrowedBooks.filter((book) => !book.returnDate).length;
          const overdueLoans = borrowedBooks.filter(
            (book) => !book.returnDate && new Date(book.dueDate) < new Date()
          ).length;

          setStatsData([
            { title: 'Total Books', value: totalBooks.toString(), icon: FaBook, color: 'text-[#1abc9c]' },
            { title: 'My Loans', value: activeLoans.toString(), icon: FaCalendar, color: 'text-[#16a085]' },
            { title: 'Overdue', value: overdueLoans.toString(), icon: FaClock, color: 'text-[#e74c3c]' },
          ]);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err.response?.data || err.message);
        navigate('/unauthorized');
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, authLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa]">
        <p className="text-[#2c3e50] text-lg sm:text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  if (isAuthorized === false) {
    if (authError) {
      navigate('/unauthorized');
      return null;
    }
    return (
      <div className="flex min-h-screen bg-[#f4f7fa] relative">
        <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} handleLogout={handleLogout} />
        <div className="flex-1 p-4 sm:p-8 w-full md:ml-[250px]">
          <Header />
          <p className="text-[#e74c3c] text-lg sm:text-xl text-center mt-8 font-medium">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
            {statsData.map((stat, index) => (
              <StatsCard key={index} title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} />
            ))}
          </div>
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
    <div className="flex min-h-screen bg-[#f4f7fa] relative">
      <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} handleLogout={handleLogout} />
      <div className="flex-1 p-4 sm:p-8 w-full md:ml-[250px]">
        <Header />
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboard;