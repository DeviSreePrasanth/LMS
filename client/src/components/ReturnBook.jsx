// ReturnBook.js

import React, { useState } from 'react';

const ReturnBook = () => {
  const [returnData, setReturnData] = useState({
    bookId: '',
    studentId: ''
  });

  const handleChange = (e) => {
    setReturnData({ ...returnData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle returning book (Make API call to backend)
    console.log('Book returned:', returnData);
  };

  return (
    <section id="return-book" className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h3 className="text-2xl font-semibold mb-4 text-center">Return Book</h3>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            name="bookId"
            placeholder="Book ID"
            value={returnData.bookId}
            onChange={handleChange}
            required
            className="p-2 mb-4 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="studentId"
            placeholder="Student ID"
            value={returnData.studentId}
            onChange={handleChange}
            required
            className="p-2 mb-4 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Return Book
          </button>
        </form>
      </div>
    </section>
  );
};

export default ReturnBook;
