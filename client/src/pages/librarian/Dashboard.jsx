import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

// Import components (corrected AddStudents to AddStudent)
import AddBook from './AddBook'; 
import BookList from './BookList';
import Students from './Students'; 
import AddStudent from './AddStudent'; // Fixed typo: AddStudents -> AddStudent

const Sidebar = ({ setActiveSection, activeSection }) => {
  const menuItems = [
    { name: 'Dashboard', section: 'dashboard' },
    { name: 'Book List', section: 'booklist' },
    { name: 'Add New Book', section: 'addbook' },
    { name: 'Students', section: 'students' },
    { name: 'Add Students', section: 'addstudent' }, // Matches case 'addstudent' below
    { name: 'Issue Book', section: 'issuebook' },
    { name: 'Return Book', section: 'returnbook' },
  ];

  return (
    <motion.div
      className="w-[250px] bg-[#2c3e50] text-white p-5 fixed h-full"
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <h2 className="text-2xl font-semibold mb-8 text-center">Library System</h2>
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
      <h1 className="text-2xl font-bold text-[#2c3e50]">Librarian Dashboard</h1>
      <div className="flex items-center space-x-3">
        <span className="text-gray-600">Welcome, Librarian</span>
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

// RecentHistory Component (Dashboard Default View)
const RecentHistory = () => {
  const historyData = [
    { id: 1, student: 'John Doe', book: 'The Great Gatsby', action: 'Issued', date: '2025-02-18' },
    { id: 2, student: 'Jane Smith', book: '1984', action: 'Returned', date: '2025-02-17' },
    { id: 3, student: 'Alice Johnson', book: 'To Kill a Mockingbird', action: 'Issued', date: '2025-02-16' },
    { id: 4, student: 'Bob Brown', book: 'Pride and Prejudice', action: 'Returned', date: '2025-02-15' },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-[#2c3e50] mb-5">Recent History</h2>
      <div className="bg-white p-5 rounded-lg shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#f4f7fa] text-[#7f8c8d]">
              <th className="p-3">Student</th>
              <th className="p-3">Book</th>
              <th className="p-3">Action</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((entry, index) => (
              <motion.tr
                key={entry.id}
                className="border-b border-gray-200 hover:bg-gray-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="p-3">{entry.student}</td>
                <td className="p-3">{entry.book}</td>
                <td className="p-3">
                  <span
                    className={`${
                      entry.action === 'Issued' ? 'text-[#1abc9c]' : 'text-[#16a085]'
                    } font-semibold`}
                  >
                    {entry.action}
                  </span>
                </td>
                <td className="p-3">{entry.date}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Placeholder Components for IssueBook and ReturnBook
const IssueBook = () => (
  <div className="mt-8">
    <h2 className="text-xl font-semibold text-[#2c3e50] mb-5">Issue Book</h2>
    <div className="bg-white p-5 rounded-lg shadow-md">
      <p className="text-gray-600">This is the Issue Book section. Add your issue form here.</p>
    </div>
  </div>
);

const ReturnBook = () => (
  <div className="mt-8">
    <h2 className="text-xl font-semibold text-[#2c3e50] mb-5">Return Book</h2>
    <div className="bg-white p-5 rounded-lg shadow-md">
      <p className="text-gray-600">This is the Return Book section. Add your return form here.</p>
    </div>
  </div>
);

// Main Dashboard Component
const LibrarianDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard'); // Default to dashboard

  const statsData = [
    { title: 'Total Books', value: '1,245' },
    { title: 'Active Loans', value: '87' },
    { title: 'Registered Members', value: '320' },
  ];

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
              {statsData.map((stat, index) => (
                <StatsCard key={index} title={stat.title} value={stat.value} />
              ))}
            </div>
            <RecentHistory />
          </>
        );
      case 'booklist':
        return <BookList />;
      case 'students':
        return <Students />;
      case 'addstudent': // Fixed typo: 'addstudents' -> 'addstudent'
        return <AddStudent />;
      case 'addbook':
        return <AddBook />;
      case 'issuebook':
        return <IssueBook />;
      case 'returnbook':
        return <ReturnBook />;
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
        {renderContent()}
      </div>
    </div>
  );
};

export default LibrarianDashboard;