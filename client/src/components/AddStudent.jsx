import React, { useState } from 'react';

const AddStudent = () => {
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    studentId: ''
  });

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle adding student (Make API call to backend)
    console.log('Student added:', studentData);
  };

  return (
    <section id="add-student" className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h3 className="text-2xl font-bold mb-6 text-purple-700">Add Student</h3>
      <form 
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={studentData.name}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Student Email"
          value={studentData.email}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="number"
          name="studentId"
          placeholder="Student ID"
          value={studentData.studentId}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button 
          type="submit"
          className="w-full p-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300"
        >
          Add Student
        </button>
      </form>
    </section>
  );
};

export default AddStudent;
