import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/books/search?query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  return (
    <nav className="bg-white/30 backdrop-blur-lg shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-2xl font-bold drop-shadow-lg">MyLibrary</Link>
          </div>

          <div className="flex-grow flex justify-center">
            <form className="relative w-full max-w-md" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search for books..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full py-2 px-4 rounded-full border border-gray-300 bg-white/60 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 transition duration-300"
              >
                Search
              </button>
            </form>
          </div>

          <ul className="flex space-x-6 text-white font-semibold">
            <li>
              <Link to="/about" className="hover:text-blue-300 transition duration-300">About</Link>
            </li>
            <li>
              <Link to="/books" className="hover:text-blue-300 transition duration-300">Books</Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-blue-300 transition duration-300">Dashboard</Link>
            </li>
            <li>
              <Link to="/" onClick={handleLogout} className="hover:text-blue-300 transition duration-300">Log Out</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Display search results below the navbar */}
      {searchResults.length > 0 && (
        <div className="absolute bg-white/80 backdrop-blur-lg shadow-lg rounded-lg w-full max-w-md mt-2 mx-auto left-0 right-0 z-50">
          {searchResults.map((book) => (
            <Link
              key={book._id}
              to={`/books/${book._id}`}
              className="block px-4 py-2 hover:bg-gray-100 transition duration-300"
            >
              {book.title}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
