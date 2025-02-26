import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import AddBook from './AddBook';
import BookList from './BookList';
import Students from './Students';
import AddStudent from './AddStudent';
import IssueBook from './IssueBook';
import ReturnBook from './ReturnBook';
import { MdSpaceDashboard } from "react-icons/md";
import { FaBook, FaUsers, FaUserPlus, FaPlus, FaUndo, FaExchangeAlt, FaBars } from 'react-icons/fa';

const Sidebar = ({ setActiveSection, activeSection }) => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar on mobile

  const menuItems = [
    { name: 'Dashboard', section: 'dashboard', icon: MdSpaceDashboard },
    { name: 'Book List', section: 'booklist', icon: FaBook },
    { name: 'Add New Book', section: 'addbook', icon: FaPlus },
    { name: 'Students', section: 'students', icon: FaUsers },
    { name: 'Add Students', section: 'addstudent', icon: FaUserPlus },
    { name: 'Issue Book', section: 'issuebook', icon: FaExchangeAlt },
    { name: 'Return Book', section: 'returnbook', icon: FaUndo },
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
        initial={{ x: 0 }} // Start at x: 0 for desktop
        animate={{ x: isOpen ? 0 : '-100%' }} // Only animate on mobile
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        // Ensure desktop doesn't animate unnecessarily
        {...(window.innerWidth >= 768 ? { animate: { x: 0 } } : {})}
      >
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center">Library System</h2>
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
      </motion.div>
    </>
  );
};

const Header = () => {
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem('profileImage') || 'https://via.placeholder.com/40'
  );
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfileImage(imageData);
        localStorage.setItem('profileImage', imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md mt-16 md:mt-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <h1 className="text-2xl font-bold text-[#2c3e50]">Librarian Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-[#7f8c8d] font-medium">Welcome, Librarian</span>
        <motion.img
          src={profileImage}
          alt="Profile"
          className="w-12 h-12 rounded-full cursor-pointer border-2 border-[#34495e]"
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

const StatsCard = ({ title, value, icon: Icon }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, ease: 'easeInOut' }}
  >
    <div className="flex items-center gap-4">
      <Icon className="text-2xl text-[#1abc9c]" />
      <div>
        <p className="text-[#7f8c8d]">{title}</p>
        <p className="text-2xl font-bold text-[#2c3e50]">{value}</p>
      </div>
    </div>
  </motion.div>
);

const LibrarianDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [statsData, setStatsData] = useState([
    { title: 'Total Books', value: '0', icon: FaBook },
    { title: 'Active Loans', value: '0', icon: FaExchangeAlt },
    { title: 'Registered Members', value: '0', icon: FaUsers },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const booksResponse = await axios.get('http://localhost:5000/api/books', config);
        const totalBooks = Array.isArray(booksResponse.data) ? booksResponse.data.length : booksResponse.data.books?.length || 0;

        const activeLoansResponse = await axios.get('http://localhost:5000/api/loans/active', config);
        const activeLoans = Array.isArray(activeLoansResponse.data)
          ? activeLoansResponse.data.length
          : activeLoansResponse.data.issuedBooks?.length || 0;

        const studentsResponse = await axios.get('http://localhost:5000/api/students', config);
        const registeredMembers = Array.isArray(studentsResponse.data) ? studentsResponse.data.length : studentsResponse.data.students?.length || 0;

        setStatsData([
          { title: 'Total Books', value: totalBooks.toString(), icon: FaBook },
          { title: 'Active Loans', value: activeLoans.toString(), icon: FaExchangeAlt },
          { title: 'Registered Members', value: registeredMembers.toString(), icon: FaUsers },
        ]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center mt-8">
          <p className="text-[#2c3e50] text-xl font-semibold">Loading...</p>
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {statsData.map((stat, index) => (
              <StatsCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
            ))}
          </div>
        );
      case 'booklist':
        return <BookList />;
      case 'students':
        return <Students />;
      case 'addstudent':
        return <AddStudent setActiveSection={setActiveSection} />;
      case 'addbook':
        return <AddBook />;
      case 'issuebook':
        return <IssueBook setActiveSection={setActiveSection} />;
      case 'returnbook':
        return <ReturnBook setActiveSection={setActiveSection} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7fa] relative">
      <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />
      <div className="flex-1 p-8 w-full md:ml-[250px]">
        <Header />
        {renderContent()}
      </div>
    </div>
  );
};

export default LibrarianDashboard;