import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AddStudent = ({ setActiveSection }) => {
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
      await axios.post('https://lms-o44p.onrender.com/api/students', formData);
      setSuccess('Student added successfully!');
      setFormData({ name: '', email: '', studentId: '' });
      setTimeout(() => setActiveSection ? setActiveSection('students') : navigate('/students'), 2000);
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
      className="p-6 bg-[#f4f7fa] max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#2c3e50]">Add New Student</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-[#1abc9c] text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-[#7f8c8d] text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-[#7f8c8d] text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
              required
            />
          </div>
          <div>
            <label htmlFor="studentId" className="block text-[#7f8c8d] text-sm font-medium mb-2">
              Student ID
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
              required
            />
          </div>
          <motion.button
            type="submit"
            className="w-full bg-[#1abc9c] hover:bg-[#16a085] text-white p-3 rounded-md transition duration-200"
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