import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Library Management System</h1>
        <nav className="space-x-6">
          <Link to="/manage-books" className="text-gray-600 hover:text-blue-600">
            Manage Books
          </Link>
          <Link to="/issued-books" className="text-gray-600 hover:text-blue-600">
            Issued Books
          </Link>
          <Link to="/manage-users" className="text-gray-600 hover:text-blue-600">
            Manage Users
          </Link>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-10 px-6">
        {/* Welcome Section */}
        <section className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Welcome, Librarian!</h2>
          <p className="text-gray-600">Manage your library efficiently and effectively.</p>
        </section>

        {/* Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/manage-books" className="group block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">Manage Books</h3>
            <p className="text-gray-600">Add, edit, and delete books.</p>
          </Link>
          <Link to="/issued-books" className="group block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">View Issued Books</h3>
            <p className="text-gray-600">Check issued and returned books.</p>
          </Link>
          <Link to="/manage-users" className="group block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">Manage Users</h3>
            <p className="text-gray-600">View and manage library users.</p>
          </Link>
          <Link to="/reports" className="group block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">Reports & Analytics</h3>
            <p className="text-gray-600">Generate and view reports.</p>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-md py-4 text-center">
        <p className="text-gray-600">&copy; 2025 Library Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
