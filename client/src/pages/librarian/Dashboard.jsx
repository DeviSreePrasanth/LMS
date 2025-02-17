import React from 'react';
import { Link } from 'react-router-dom';

const LibrarianDashboard = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold mb-6">Librarian Dashboard</h2>
      <div className="flex gap-8">
        <Link to="/librarian/booklist" className="bg-blue-600 text-white p-4 rounded">View Books</Link>
        <Link to="/librarian/addbook" className="bg-green-600 text-white p-4 rounded">Add Book</Link>
        <Link to="/librarian/students" className="bg-yellow-600 text-white p-4 rounded">View Students</Link>
      </div>
    </div>
  );
};

export default LibrarianDashboard;
