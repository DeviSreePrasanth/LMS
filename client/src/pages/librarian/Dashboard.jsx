import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import AddBook from './AddBook';
import BookList from './BookList';
import Students from './Students';
import AddStudent from './AddStudent';
import IssueBook from './IssueBook';
import ReturnBook from './ReturnBook';
import { BiLogOut } from 'react-icons/bi';
import { MdSpaceDashboard } from "react-icons/md";
import { FaBook, FaUsers, FaUserPlus, FaPlus, FaUndo, FaExchangeAlt, FaBars, FaTimes, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

// Sidebar component (unchanged)
const Sidebar = ({ setActiveSection, activeSection, isOpen, setIsOpen, handleLogout }) => {
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
    <motion.div
      className={`w-[250px] bg-[#2c3e50] text-white p-5 fixed h-full flex flex-col justify-between shadow-xl z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      initial={{ x: 0 }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.1, ease: [0.4, 0, 0.2, 1] }}
      {...(window.innerWidth >= 768 ? { animate: { x: 0 } } : {})}
    >
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-center flex-1">Library System</h2>
          <FaTimes
            className="text-2xl text-white cursor-pointer md:hidden"
            onClick={() => setIsOpen(false)}
          />
        </div>
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
                setIsOpen(false);
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
  );
};

// Header component (unchanged)
const Header = ({ isOpen, setIsOpen }) => {
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
      className="fixed top-0 left-0 w-full bg-white p-4 sm:px-6 py-4 shadow-md z-30 md:ml-[250px] md:w-[calc(100%-250px)]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <FaBars
            className="text-2xl text-[#2c3e50] cursor-pointer md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          />
          <h1 className="text-xl sm:text-2xl font-bold text-[#2c3e50]">Librarian Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-[#7f8c8d] font-medium text-sm sm:text-base">Welcome, Librarian</span>
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
      </div>
    </motion.div>
  );
};

// StatsCard component (unchanged)
const StatsCard = ({ title, value, icon: Icon }) => (
  <motion.div
    className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 w-full"
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, ease: 'easeInOut' }}
  >
    <div className="flex items-center gap-4">
      <Icon className="text-2xl text-[#1abc9c]" />
      <div>
        <p className="text-[#7f8c8d] text-sm sm:text-base">{title}</p>
        <p className="text-xl sm:text-2xl font-bold text-[#2c3e50]">{value}</p>
      </div>
    </div>
  </motion.div>
);

// Updated RecentActivity with new bottom and side effects
const RecentActivity = ({ activities }) => (
  <motion.div
    className="bg-white p-6 rounded-xl mt-6 w-full max-w-xl border border-gray-100 relative overflow-hidden"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    {/* Side gradient effect */}
    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#1abc9c] to-[#16a085] opacity-75" />
    {/* Bottom gradient effect */}
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#1abc9c] to-[#3498db] opacity-75" />
    
    <h3 className="text-xl font-semibold text-[#2c3e50] mb-4 pb-2 relative z-10">Recent Activity</h3>
    <ul className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar relative z-10">
      {activities.slice(0, 5).map((activity, index) => (
        <motion.li
          key={index}
          className="flex items-start gap-3 p-3 bg-[#f8fafc] rounded-md hover:bg-[#eef2ff] transition-all duration-300 border border-gray-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.01, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        >
          <FaClock className="text-[#1abc9c] text-base mt-1 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-[#2c3e50] font-medium leading-tight">
              {activity.action}
              {activity.studentName && (
                <span className="text-[#1abc9c] ml-1 font-normal">to {activity.studentName}</span>
              )}
            </p>
            <p className="text-xs text-[#6b7280] mt-1 font-light">{new Date(activity.timestamp).toLocaleString()}</p>
          </div>
        </motion.li>
      ))}
    </ul>
    <style jsx>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f8fafc;
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #1abc9c;
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #16a085;
      }
    `}</style>
  </motion.div>
);

// Updated BooksByCategory with labels for top 10 categories
const BooksByCategory = ({ categories, booksData }) => {
  const sortedCategories = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
  const labels = sortedCategories.map(([label]) => label);
  const values = sortedCategories.map(([, value]) => value);

  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
          '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 20,
        hoverBackgroundColor: [
          '#FF8787', '#6BE8DF', '#63C8E5', '#AEE5CB', '#FFF5C9',
          '#E5BFBF', '#B377D0', '#5DADE2', '#F39C41', '#52E495',
        ],
      },
    ],
  };

  const getCategoryDetails = (category) => {
    const booksInCategory = booksData.filter(book => (book.category || 'Uncategorized') === category);
    const totalBooks = booksInCategory.length;
    const sampleBooks = booksInCategory.slice(0, 3).map(book => book.title).join(', ');
    return `Total Books: ${totalBooks}\nSample Titles: ${sampleBooks}${totalBooks > 3 ? '...' : ''}`;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // Show labels
        position: 'right',
        labels: {
          font: {
            size: 12,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(44, 62, 80, 0.95)',
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 6,
        boxPadding: 4,
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (context) => {
            const category = context.label;
            return getCategoryDetails(category).split('\n');
          },
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1500,
      easing: 'easeOutBounce',
    },
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-md mt-6 w-full max-w-xl border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
    >
      <motion.h3
        className="text-xl font-semibold text-[#2c3e50] mb-6 bg-gradient-to-r from-[#2c3e50] to-[#1abc9c] text-transparent bg-clip-text border-b border-gray-200 pb-2"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Top 10 Book Categories
      </motion.h3>
      <div className="relative h-80 w-full flex items-center justify-center">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#f4f7fa] to-[#ffffff] rounded-full opacity-50"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <Pie data={data} options={options} />
      </div>
    </motion.div>
  );
};

// Updated LibrarianDashboard component (unchanged except passing booksData)
const LibrarianDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [statsData, setStatsData] = useState([
    { title: 'Total Books', value: '0', icon: FaBook },
    { title: 'Active Loans', value: '0', icon: FaExchangeAlt },
    { title: 'Registered Members', value: '0', icon: FaUsers },
  ]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [categories, setCategories] = useState({});
  const [booksData, setBooksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const booksResponse = await axios.get('https://lms-o44p.onrender.com/api/books', config);
        const books = Array.isArray(booksResponse.data) ? booksResponse.data : booksResponse.data.books || [];
        setBooksData(books);
        const totalBooks = books.length;

        const activeLoansResponse = await axios.get('https://lms-o44p.onrender.com/api/loans/active', config);
        const activeLoansCount = activeLoansResponse.data.loans?.length || 0;

        const studentsResponse = await axios.get('https://lms-o44p.onrender.com/api/students', config);
        const registeredMembers = Array.isArray(studentsResponse.data) ? studentsResponse.data.length : studentsResponse.data.students?.length || 0;

        setStatsData([
          { title: 'Total Books', value: totalBooks.toString(), icon: FaBook },
          { title: 'Active Loans', value: activeLoansCount.toString(), icon: FaExchangeAlt },
          { title: 'Registered Members', value: registeredMembers.toString(), icon: FaUsers },
        ]);

        const activitiesResponse = await axios.get('https://lms-o44p.onrender.com/api/activities/recent', config);
        setRecentActivities(activitiesResponse.data.slice(0, 5));

        const categoryData = books.reduce((acc, book) => {
          const category = book.category || 'Uncategorized';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
        setCategories(categoryData);

        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err.response?.data || err.message);
        setError('Failed to load dashboard data. Please try again later.');
        
        setRecentActivities([
          { action: "Book 'The Great Gatsby' issued", studentName: "John Doe", timestamp: new Date() },
          { action: "Book '1984' returned", studentName: "Jane Smith", timestamp: new Date(Date.now() - 3600000) },
          { action: "New student 'Alice Brown' added", timestamp: new Date(Date.now() - 7200000) },
          { action: "Book 'To Kill a Mockingbird' issued", studentName: "Bob Wilson", timestamp: new Date(Date.now() - 10800000) },
          { action: "Book 'Pride and Prejudice' returned", studentName: "Emma Davis", timestamp: new Date(Date.now() - 14400000) },
        ]);
        setCategories({
          Fiction: 50,
          Nonfiction: 30,
          Science: 20,
          History: 15,
          Biography: 10,
          Fantasy: 8,
          Mystery: 7,
          Romance: 6,
          Thriller: 5,
          Adventure: 4,
        });
        setBooksData([
          { title: "The Great Gatsby", category: "Fiction" },
          { title: "1984", category: "Fiction" },
          { title: "To Kill a Mockingbird", category: "Fiction" },
          { title: "Sapiens", category: "Nonfiction" },
          { title: "A Brief History of Time", category: "Science" },
          { title: "The Hobbit", category: "Fantasy" },
          { title: "The Da Vinci Code", category: "Mystery" },
          { title: "Pride and Prejudice", category: "Romance" },
          { title: "The Bourne Identity", category: "Thriller" },
          { title: "Treasure Island", category: "Adventure" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profileImage');
    navigate('/');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <p className="text-[#2c3e50] text-xl font-semibold">Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <p className="text-[#e74c3c] text-xl font-semibold">{error}</p>
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6 px-3 md:px-6 w-full max-w-7xl">
              {statsData.map((stat, index) => (
                <StatsCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-7xl mt-6 px-3 md:px-6">
              <div className="flex-1">
                <RecentActivity activities={recentActivities} />
              </div>
              <div className="flex-1">
                <BooksByCategory categories={categories} booksData={booksData} />
              </div>
            </div>
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
      <Sidebar 
        setActiveSection={setActiveSection} 
        activeSection={activeSection} 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        handleLogout={handleLogout} 
      />
      <div className="flex-1 w-full md:ml-[250px] pt-16 pl-0 md:pl-6">
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />
        <br />
        {renderContent()}
      </div>
    </div>
  );
};

export default LibrarianDashboard;