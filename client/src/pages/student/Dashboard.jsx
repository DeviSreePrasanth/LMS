  import React, { useState, useRef } from 'react';
  import { motion } from 'framer-motion';

  // Import existing components
  import StudentBookList from '../student/BookList'; // src/pages/student/BookList

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

    // Handle image upload
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageData = reader.result;
          setProfileImage(imageData);
          localStorage.setItem('studentProfileImage', imageData); // Save to localStorage with unique key
        };
        reader.readAsDataURL(file);
      }
    };

    // Reset to default image
    const resetImage = () => {
      setProfileImage('https://via.placeholder.com/40');
      localStorage.removeItem('studentProfileImage');
    };

    // Trigger file input click
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

  // MyLoans Component (Placeholder for student's borrowed books)
  const MyLoans = () => {
    const loanData = [
      { id: 1, book: 'The Great Gatsby', dueDate: '2025-03-01', status: 'Borrowed' },
      { id: 2, book: '1984', dueDate: '2025-02-25', status: 'Overdue' },
    ];

    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-[#2c3e50] mb-5">My Loans</h2>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f4f7fa] text-[#7f8c8d]">
                <th className="p-3">Book</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loanData.map((loan, index) => (
                <motion.tr
                  key={loan.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <td className="p-3">{loan.book}</td>
                  <td className="p-3">{loan.dueDate}</td>
                  <td className="p-3">
                    <span
                      className={`${
                        loan.status === 'Borrowed' ? 'text-[#1abc9c]' : 'text-red-500'
                      } font-semibold`}
                    >
                      {loan.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Main Student Dashboard Component
  const StudentDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard'); // Default to dashboard

    const statsData = [
      { title: 'Total Books', value: '1,245' },
      { title: 'My Loans', value: '2' },
      { title: 'Overdue', value: '1' },
    ];

    // Render content based on active section
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