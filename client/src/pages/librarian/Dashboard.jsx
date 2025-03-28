import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import AddBook from "./AddBook";
import BookList from "./BookList";
import Students from "./Students";
import AddStudent from "./AddStudent";
import IssueBook from "./IssueBook";
import ReturnBook from "./ReturnBook";
import { BiLogOut } from "react-icons/bi";
import { MdSpaceDashboard } from "react-icons/md";
import {
  FaBook,
  FaUsers,
  FaUserPlus,
  FaPlus,
  FaUndo,
  FaExchangeAlt,
  FaBars,
  FaTimes,
  FaClock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

// Sidebar, Header, StatsCard, TopBorrowedBooks, and BooksByCategory remain unchanged
const Sidebar = ({
  setActiveSection,
  activeSection,
  isOpen,
  setIsOpen,
  handleLogout,
}) => {
  const menuItems = [
    { name: "Dashboard", section: "dashboard", icon: MdSpaceDashboard },
    { name: "Book List", section: "booklist", icon: FaBook },
    { name: "Add New Book", section: "addbook", icon: FaPlus },
    { name: "Students", section: "students", icon: FaUsers },
    { name: "Add Students", section: "addstudent", icon: FaUserPlus },
    { name: "Issue Book", section: "issuebook", icon: FaExchangeAlt },
    { name: "Return Book", section: "returnbook", icon: FaUndo },
  ];

  return (
    <motion.div
      className={`w-[250px] bg-[#2c3e50] text-white p-5 fixed h-full flex flex-col justify-between shadow-xl z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      initial={{ x: 0 }}
      animate={{ x: isOpen ? 0 : "-100%" }}
      transition={{ duration: 0.1, ease: [0.4, 0, 0.2, 1] }}
      {...(window.innerWidth >= 768 ? { animate: { x: 0 } } : {})}
    >
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-center flex-1">
            Library System
          </h2>
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
                activeSection === item.section
                  ? "bg-[#1abc9c]"
                  : "bg-[#34495e] hover:bg-[#1abc9c]"
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

const Header = ({ isOpen, setIsOpen }) => {
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || "https://via.placeholder.com/40"
  );
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfileImage(imageData);
        localStorage.setItem("profileImage", imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 w-full bg-white p-4 sm:px-6 py-4 shadow-md z-30 md:ml-[250px] md:w-[calc(100%-250px)]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <FaBars
            className="text-2xl text-[#2c3e50] cursor-pointer md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          />
          <h1 className="text-xl sm:text-2xl font-bold text-[#2c3e50]">
            Librarian Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-[#7f8c8d] font-medium text-sm sm:text-base">
            Welcome, Librarian
          </span>
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

const StatsCard = ({ title, value, icon: Icon }) => (
  <motion.div
    className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 w-full"
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
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

const RecentActivity = ({ activities }) => (
  <motion.div
    className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6 w-full max-w-3xl mx-auto"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
  >
    <h3 className="text-xl font-semibold text-[#2c3e50] mb-4">
      Recent Activity
    </h3>
    <ul className="space-y-4 max-h-64 overflow-y-auto">
      {activities.slice(0, 3).map((activity, index) => (
        <motion.li
          key={index}
          className="flex items-center gap-3 p-3 bg-[#f4f7fa] rounded-md hover:bg-[#e0e7ff] transition-all duration-300"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <FaClock className="text-[#1abc9c] text-lg" />
          <div>
            <p className="text-sm text-[#2c3e50] font-medium">
              {activity.action}
            </p>
            {/* Display issueDate if available (for issuance activities) */}
            {activity.issueDate && (
              <p className="text-xs text-[#7f8c8d]">
                Issued on: {new Date(activity.issueDate).toLocaleString()}
              </p>
            )}
            <p className="text-xs text-[#7f8c8d]">
              {new Date(activity.timestamp).toLocaleString()}
            </p>
          </div>
        </motion.li>
      ))}
    </ul>
  </motion.div>
);

const TopBorrowedBooks = ({ books }) => (
  <motion.div
    className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6 w-full max-w-3xl mx-auto"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
  >
    <h3 className="text-xl font-semibold text-[#2c3e50] mb-4">
      Top Borrowed Books
    </h3>
    <ul className="space-y-4">
      {books.map((book, index) => (
        <motion.li
          key={index}
          className="flex items-center gap-3 p-3 bg-[#f4f7fa] rounded-md hover:bg-[#e0e7ff] transition-all duration-300"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <FaBook className="text-[#1abc9c] text-lg" />
          <div className="flex-1">
            <p className="text-sm text-[#2c3e50] font-medium">{book.title}</p>
            <p className="text-xs text-[#7f8c8d]">
              Borrowed {book.borrowCount} times
            </p>
          </div>
          <span className="text-xs font-semibold text-[#1abc9c]">{`#${
            index + 1
          }`}</span>
        </motion.li>
      ))}
    </ul>
  </motion.div>
);

const BooksByCategory = ({ categories }) => {
  // Sort categories by count and take top 10
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
          "#FF6B6B", // Vibrant Red
          "#4ECDC4", // Turquoise
          "#45B7D1", // Sky Blue
          "#96CEB4", // Mint Green
          "#FFEEAD", // Soft Yellow
          "#D4A5A5", // Soft Pink
          "#9B59B6", // Purple
          "#3498DB", // Bright Blue
          "#E67E22", // Orange
          "#2ECC71", // Emerald Green
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 15,
        hoverBackgroundColor: [
          "#FF8787", // Lighter Red
          "#6BE8DF", // Lighter Turquoise
          "#63C8E5", // Lighter Sky Blue
          "#AEE5CB", // Lighter Mint Green
          "#FFF5C9", // Lighter Soft Yellow
          "#E5BFBF", // Lighter Soft Pink
          "#B377D0", // Lighter Purple
          "#5DADE2", // Lighter Bright Blue
          "#F39C41", // Lighter Orange
          "#52E495", // Lighter Emerald Green
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows custom sizing
    aspectRatio: 1, // Maintains a 1:1 aspect ratio for the chart (circular shape)
    plugins: {
      legend: {
        position: window.innerWidth < 768 ? "bottom" : "right", // Legend below on mobile, right on desktop
        labels: {
          font: {
            size: window.innerWidth < 640 ? 10 : window.innerWidth < 1024 ? 12 : 14, // Smaller font on mobile, medium on tablet, larger on desktop
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          },
          padding: window.innerWidth < 640 ? 8 : window.innerWidth < 1024 ? 12 : 20, // Reduced padding on mobile, medium on tablet, larger on desktop
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: window.innerWidth < 640 ? 6 : window.innerWidth < 1024 ? 8 : 10, // Smaller legend boxes on mobile, medium on tablet, larger on desktop
          color: "#2c3e50",
          generateLabels: (chart) => {
            return chart.data.labels.map((label, index) => ({
              text: label.length > 15 ? `${label.slice(0, 15)}...` : label, // Truncate long labels
              fillStyle: chart.data.datasets[0].backgroundColor[index],
              strokeStyle: "#ffffff",
              lineWidth: 1,
              hidden: chart.getDataVisibility(index) === false,
              index: index,
            }));
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(44, 62, 80, 0.9)",
        titleFont: {
          size: window.innerWidth < 640 ? 12 : window.innerWidth < 1024 ? 14 : 16, // Smaller on mobile, medium on tablet, larger on desktop
          weight: "bold",
          color: "#ffffff",
        },
        bodyFont: {
          size: window.innerWidth < 640 ? 10 : window.innerWidth < 1024 ? 12 : 14, // Smaller on mobile, medium on tablet, larger on desktop
          color: "#ffffff",
        },
        padding: window.innerWidth < 640 ? 6 : window.innerWidth < 1024 ? 8 : 12, // Smaller padding on mobile, medium on tablet, larger on desktop
        cornerRadius: 6,
        boxPadding: 4,
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} books`,
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1200,
      easing: "easeOutCubic",
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    },
  };
  return (
    <motion.div
      className="bg-white p-4 sm:p-6 rounded-xl mt-6 w-full max-w-3xl mx-auto border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="text-lg sm:text-xl font-semibold text-[#2c3e50] mb-4 sm:mb-6 bg-gradient-to-r from-[#2c3e50] to-[#1abc9c] text-transparent bg-clip-text">
        Top 10 Categories
      </h3>
      <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] flex items-center justify-center">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#f4f7fa] to-[#e6f0ff] rounded-full opacity-40"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <Pie data={data} options={options} />
      </div>
    </motion.div>
  );
};

const LibrarianDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [statsData, setStatsData] = useState([
    { title: "Total Books", value: "0", icon: FaBook },
    { title: "Active Loans", value: "0", icon: FaExchangeAlt },
    { title: "Registered Members", value: "0", icon: FaUsers },
  ]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const booksResponse = await axios.get(
          "https://lms-o44p.onrender.com/api/books",
          config
        );
        const totalBooks = Array.isArray(booksResponse.data)
          ? booksResponse.data.length
          : booksResponse.data.books?.length || 0;

        const activeLoansResponse = await axios.get(
          "https://lms-o44p.onrender.com/api/loans/active",
          config
        );
        const activeLoansCount = activeLoansResponse.data.loans?.length || 0;

        const studentsResponse = await axios.get(
          "https://lms-o44p.onrender.com/api/students",
          config
        );
        const registeredMembers = Array.isArray(studentsResponse.data)
          ? studentsResponse.data.length
          : studentsResponse.data.students?.length || 0;

        setStatsData([
          { title: "Total Books", value: totalBooks.toString(), icon: FaBook },
          {
            title: "Active Loans",
            value: activeLoansCount.toString(),
            icon: FaExchangeAlt,
          },
          {
            title: "Registered Members",
            value: registeredMembers.toString(),
            icon: FaUsers,
          },
        ]);

        const activitiesResponse = await axios.get(
          "https://lms-o44p.onrender.com/api/activities/recent",
          config
        );
        // Assuming the backend returns activities with an optional issueDate field
        setRecentActivities(activitiesResponse.data.slice(0, 5));

        const topBooksResponse = await axios.get(
          "https://lms-o44p.onrender.com/api/books/top-borrowed",
          config
        );
        setTopBooks(topBooksResponse.data.slice(0, 5));

        const categoryData = booksResponse.data.reduce((acc, book) => {
          const category = book.category || "Uncategorized";
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
        setCategories(categoryData);
        setError(null);
      } catch (err) {
        console.error(
          "Error fetching dashboard data:",
          err.response?.data || err.message
        );
        setError("Failed to load dashboard data. Please try again later.");
        // Fallback data with issueDate for issuance activities
        setRecentActivities([
          {
            action: "Book 'The Great Gatsby' issued",
            timestamp: new Date(),
            issueDate: new Date(), // Add issueDate for issuance activity
          },
          {
            action: "Book '1984' returned",
            timestamp: new Date(Date.now() - 3600000),
          },
          {
            action: "New student 'John Doe' added",
            timestamp: new Date(Date.now() - 7200000),
          },
        ]);
        setTopBooks([
          { title: "The Great Gatsby", borrowCount: 15 },
          { title: "1984", borrowCount: 12 },
          { title: "To Kill a Mockingbird", borrowCount: 10 },
        ]);
        setCategories({
          Fiction: 50,
          Nonfiction: 30,
          Science: 20,
          History: 15,
          Uncategorized: 10,
          Fantasy: 8,
          Mystery: 7,
          Romance: 6,
          Thriller: 5,
          Adventure: 4,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profileImage");
    navigate("/login");
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
      case "dashboard":
        return (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 pt-4 sm:pt-6 px-3 md:px-6 justify-start w-full max-w-7xl">
              {statsData.map((stat, index) => (
                <StatsCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl mt-6">
              <RecentActivity activities={recentActivities} />
              <TopBorrowedBooks books={topBooks} />
            </div>
            <BooksByCategory categories={categories} />
          </div>
        );
      case "booklist":
        return <BookList />;
      case "students":
        return <Students />;
      case "addstudent":
        return <AddStudent setActiveSection={setActiveSection} />;
      case "addbook":
        return <AddBook />;
      case "issuebook":
        return <IssueBook setActiveSection={setActiveSection} />;
      case "returnbook":
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