import React, { useState, useRef, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import StudentBookList from "../student/BookList";
import BorrowedBooks from "../student/BorrowedBooks";
import { useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { FaBook, FaClock, FaCalendar, FaBars, FaTimes } from "react-icons/fa";

// Sidebar Component (unchanged)
const Sidebar = ({
  setActiveSection,
  activeSection,
  handleLogout,
  isOpen,
  setIsOpen,
}) => {
  const menuItems = [
    { name: "Dashboard", section: "dashboard", icon: FaBook },
    { name: "Book List", section: "booklist", icon: FaCalendar },
    { name: "Borrowed Books", section: "studentdetails", icon: FaClock },
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
          <h2 className="text-xl sm:text-2xl font-bold text-center flex-1">
            Student Portal
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

// Updated Header Component with Cloudinary
const Header = ({ isOpen, setIsOpen, name }) => {
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("studentProfileImage") || "https://via.placeholder.com/40"
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "student_profile"); // Replace with your upload preset
      formData.append("cloud_name", "your_cloud_name"); // Replace with your Cloud Name

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", // Replace with your Cloud Name
          formData
        );
        const imageUrl = response.data.secure_url;
        setProfileImage(imageUrl);
        localStorage.setItem("studentProfileImage", imageUrl); // Store URL in localStorage
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 w-full bg-white px-4 sm:px-6 py-4 shadow-md z-30 md:ml-[250px] md:w-[calc(100%-250px)]"
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
            Student Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-[#7f8c8d] font-medium text-sm sm:text-base">
            Welcome, {name || "Student"}
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
          {isUploading && (
            <span className="text-[#2c3e50] text-sm">Uploading...</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// StatsCard Component (unchanged)
const StatsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 w-full"
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
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

// Updated StudentDashboard Component (unchanged except Header usage)
const StudentDashboard = () => {
  const {
    user,
    logout,
    loading: authLoading,
    error: authError,
  } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [statsData, setStatsData] = useState([
    { title: "Total Books", value: "0", icon: FaBook, color: "text-[#1abc9c]" },
    {
      title: "My Loans",
      value: "0",
      icon: FaCalendar,
      color: "text-[#16a085]",
    },
    { title: "Overdue", value: "0", icon: FaClock, color: "text-[#e74c3c]" },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (authLoading || !user) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setFetchError("No session token found. Please log in again.");
          navigate("/");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const studentResponse = await axios.get(
          `https://lms-o44p.onrender.com/api/students/email/${user.email}`,
          config
        );
        if (!studentResponse.data) {
          throw new Error("Student not found");
        }
        setStudentName(studentResponse.data.name || user.email);
        const studentId = studentResponse.data._id;

        const booksResponse = await axios.get(
          "https://lms-o44p.onrender.com/api/books",
          config
        );
        const totalBooks = Array.isArray(booksResponse.data)
          ? booksResponse.data.length
          : 0;

        const loansResponse = await axios.get(
          `https://lms-o44p.onrender.com/api/loans?studentId=${studentId}`,
          config
        );
        const allLoans = loansResponse.data || [];

        const activeLoans = allLoans.filter((loan) => !loan.returnDate).length;
        const overdueLoans = allLoans.filter(
          (loan) => !loan.returnDate && new Date(loan.dueDate) < new Date()
        ).length;

        setStatsData([
          {
            title: "Total Books",
            value: totalBooks.toString(),
            icon: FaBook,
            color: "text-[#1abc9c]",
          },
          {
            title: "My Loans",
            value: activeLoans.toString(),
            icon: FaCalendar,
            color: "text-[#16a085]",
          },
          {
            title: "Overdue",
            value: overdueLoans.toString(),
            icon: FaClock,
            color: "text-[#e74c3c]",
          },
        ]);
        setFetchError(null);
      } catch (err) {
        console.error(
          "Error fetching dashboard data:",
          err.response?.data || err.message
        );
        setFetchError(
          err.response?.status === 404
            ? "Student profile not found. Contact your librarian."
            : "Failed to load dashboard data. Please try refreshing."
        );
        setStudentName(user.email);
        setStatsData([
          {
            title: "Total Books",
            value: "N/A",
            icon: FaBook,
            color: "text-[#1abc9c]",
          },
          {
            title: "My Loans",
            value: "0",
            icon: FaCalendar,
            color: "text-[#16a085]",
          },
          {
            title: "Overdue",
            value: "0",
            icon: FaClock,
            color: "text-[#e74c3c]",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, authLoading, navigate]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("studentProfileImage");
    navigate("/");
  };

  const renderContent = () => {
    if (loading || authLoading) {
      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <p className="text-[#2c3e50] text-xl font-semibold">Loading...</p>
        </div>
      );
    }

    if (authError || fetchError) {
      return (
        <p className="text-[#e74c3c] text-lg sm:text-xl text-center pt-4 sm:pt-6 font-medium">
          {authError || fetchError}
        </p>
      );
    }

    switch (activeSection) {
      case "dashboard":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 pt-4 sm:pt-6 px-3 md:px-6 justify-start">
            {statsData.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </div>
        );
      case "booklist":
        return <StudentBookList />;
      case "studentdetails":
        return <BorrowedBooks />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7fa] relative">
      <Sidebar
        setActiveSection={setActiveSection}
        activeSection={activeSection}
        handleLogout={handleLogout}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div className="flex-1 w-full md:ml-[250px] pt-16 pl-0 md:pl-6">
        <Header isOpen={isOpen} setIsOpen={setIsOpen} name={studentName} />
        <br />
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboard;