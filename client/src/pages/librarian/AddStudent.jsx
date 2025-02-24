import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // For redirecting after submission

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('http://localhost:5000/api/students', formData);
      setSuccess('Student added successfully!');
      setFormData({ name: '', email: '', studentId: '' });// Redirect to students page after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student');
    }
  };

  const palette = {
    primary: '#2c3e50',
    accent: '#1abc9c',
    muted: '#7f8c8d',
    bg: '#f4f7fa',
    headerBg: '#1f2937',
  };

  return (
    <motion.div
      className="p-6 bg-[#f4f7fa] min-h-screen flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className={`text-3xl font-bold mb-6 text-center text-[#2c3e50]`}>Add New Student</h2>
        
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className={`block text-[#2c3e50] font-semibold mb-2`}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c]"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className={`block text-[#2c3e50] font-semibold mb-2`}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c]"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="studentId" className={`block text-[#2c3e50] font-semibold mb-2`}>
              Student ID
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c]"
              required
            />
          </div>

          <motion.button
            type="submit"
            className={`w-full py-2 rounded-md text-white bg-[#1e3a8a] hover:bg-[#1e40af] transition duration-200`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Student
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddStudent;