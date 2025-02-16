import React, { useState } from 'react';
import Profile from './Profile';
import AddBook from './AddBook';
import AddTransaction from './AddTransaction';
import SearchStudent from './SearchStudent';
import AddStudent from './AddStudent';
import ReturnBook from './ReturnBook';
import BookList from './BookList';

const Dashboard = () => {
  // State to control which component to display
  const [currentPage, setCurrentPage] = useState('profile');

  // Function to handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to handle logout (Just redirect to login)
  const handleLogout = () => {
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col p-5 fixed h-full shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-10 text-blue-400">Dashboard</h2>
        <ul className="space-y-6">
          <li>
            <button
              className={`w-full text-left py-2 px-4 rounded-lg transition duration-300 ${
                currentPage === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-blue-800 hover:text-white'
              }`}
              onClick={() => handlePageChange('profile')}
            >
              Profile
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left py-2 px-4 rounded-lg transition duration-300 ${
                currentPage === 'bookList'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-blue-800 hover:text-white'
              }`}
              onClick={() => handlePageChange('bookList')}
            >
              Book List
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left py-2 px-4 rounded-lg transition duration-300 ${
                currentPage === 'addBook'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-blue-800 hover:text-white'
              }`}
              onClick={() => handlePageChange('addBook')}
            >
              Add Book
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left py-2 px-4 rounded-lg transition duration-300 ${
                currentPage === 'addTransaction'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-blue-800 hover:text-white'
              }`}
              onClick={() => handlePageChange('addTransaction')}
            >
              Add Transaction
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left py-2 px-4 rounded-lg transition duration-300 ${
                currentPage === 'searchStudent'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-blue-800 hover:text-white'
              }`}
              onClick={() => handlePageChange('searchStudent')}
            >
              Search Student
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left py-2 px-4 rounded-lg transition duration-300 ${
                currentPage === 'addStudent'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-blue-800 hover:text-white'
              }`}
              onClick={() => handlePageChange('addStudent')}
            >
              Add Student
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left py-2 px-4 rounded-lg transition duration-300 ${
                currentPage === 'returnBook'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-blue-800 hover:text-white'
              }`}
              onClick={() => handlePageChange('returnBook')}
            >
              Return Book
            </button>
          </li>
          <li>
            <button
              className="w-full text-left py-2 px-4 rounded-lg text-red-500 hover:text-red-600 transition duration-300"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8 w-full overflow-y-auto">
        {currentPage === 'profile' && <Profile />}
        {currentPage === 'bookList' && <BookList />}
        {currentPage === 'addBook' && <AddBook />}
        {currentPage === 'addTransaction' && <AddTransaction />}
        {currentPage === 'searchStudent' && <SearchStudent />}
        {currentPage === 'addStudent' && <AddStudent />}
        {currentPage === 'returnBook' && <ReturnBook />}
      </div>
    </div>
  );
};

export default Dashboard;
