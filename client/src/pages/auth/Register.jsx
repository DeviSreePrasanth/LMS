import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const Register = () => {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('student'); // Default role as 'student'
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      
      if (response.data.token) {
        login(response.data.token);
        setSuccessMessage('Registration successful! Redirecting to dashboard...');
        setError('');
        setTimeout(() => navigate('/student/dashboard'), 1000);
      } else {
        setError('Registration failed. Please try again.');
        setSuccessMessage('');
      }
    } catch (err) {
      console.error("Registration Error:", err.response?.data || err.message);
      setError('Registration failed. Please try again.');
      setSuccessMessage('');
    }
  };

  // Librarian-specific color palette (consistent with Login and Dashboard)
  const palette = {
    primary: '#2c3e50', // Dark blue-gray for headers and text
    accent: '#1abc9c',  // Teal for highlights and buttons
    muted: '#7f8c8d',   // Muted gray for secondary text
    bg: '#f4f7fa',      // Light gray background
    headerBg: '#1f2937', // Darker gray for headers
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa] px-4">
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <h2 className={`text-3xl font-bold text-center text-[#2c3e50] mb-6`}>Register</h2>
        {successMessage && (
          <motion.p
            className="text-[#1abc9c] text-sm text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {successMessage}
          </motion.p>
        )}
        {error && (
          <motion.p
            className="text-red-500 text-sm text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#7f8c8d] mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#7f8c8d] mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#7f8c8d] mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
              placeholder="Enter your password"
              required
            />
          </div>
          <motion.button
            type="submit"
            className="w-full bg-[#1abc9c] hover:bg-[#16a085] text-white p-3 rounded-md transition duration-300 ease-in-out font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.button>
        </form>
        <p className="text-center text-[#7f8c8d] mt-4">
          Already have an account?{' '}
          <Link to="/" className="text-[#1abc9c] hover:text-[#16a085] font-semibold transition duration-200">
            Sign in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;