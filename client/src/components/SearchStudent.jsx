// SearchStudent.js

import React, { useState } from 'react';

const SearchStudent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]); // Placeholder for students data

  const handleSearch = () => {
    // Placeholder API call to fetch students based on searchQuery
    console.log('Searching for student:', searchQuery);
    // Example students list
    setStudents([{ name: 'John Doe', id: '123' }, { name: 'Jane Doe', id: '124' }]);
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h3 className="text-2xl font-semibold mb-4 text-center">Search Student</h3>
        <input
          type="text"
          placeholder="Enter Student Name or ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 mb-4 border rounded-lg w-full focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-teal-500 text-white p-2 rounded-lg w-full hover:bg-teal-600 transition duration-300"
        >
          Search
        </button>
        <div className="student-list mt-4">
          {students.length > 0 ? (
            students.map((student, index) => (
              <p key={index} className="text-gray-700">
                {student.name} (ID: {student.id})
              </p>
            ))
          ) : (
            <p className="text-gray-500">No students found</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchStudent;
