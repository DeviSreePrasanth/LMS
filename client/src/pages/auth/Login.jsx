import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';

// Function to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState(''); // Changed from registrationNumber to studentId
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const loginResponse = await axios.post('https://lms-production-c635.up.railway.app/api/auth/login', {
        email,
        password,
        studentId, // Send studentId instead of registrationNumber
      });
      console.log('Full login response:', loginResponse.data);

      const { token, user } = loginResponse.data;
      if (!token || !user) {
        throw new Error('Invalid server response: missing token or user data');
      }

      // Decode token to get email if not present in user object
      const decodedToken = decodeToken(token);
      const userEmail = user.email || decodedToken?.email || email;

      console.log('User role:', user.role || 'Role not found');
      console.log('User email:', userEmail || 'Email not found');
      console.log('User ID:', user.id || 'ID not found');

      if (!userEmail) {
        throw new Error('Email not received from server or token');
      }

      const userData = {
        id: user.id,
        email: userEmail,
        role: user.role,
        studentId: user.studentId || studentId, // Use studentId from response or input
      };

      await login(token, userData);

      // Require studentId only for students
      if (user.role === 'student' && !studentId) {
        throw new Error('Student ID is required for students');
      }

      switch (user.role) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'librarian':
          navigate('/librarian/dashboard');
          break;
        default:
          navigate('/unauthorized');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Invalid credentials or server error');
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
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa] px-4">
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <h2 className="text-3xl font-bold text-center text-[#2c3e50] mb-6">Login</h2>
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
        <form onSubmit={handleLogin} className="space-y-6">
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
            <label htmlFor="studentId" className="block text-sm font-medium text-[#7f8c8d] mb-2">
              Student ID (Students Only)
            </label>
            <input
              type="text"
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
              placeholder="Enter your student ID"
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
            Sign In
          </motion.button>
        </form>
        <p className="text-center text-[#7f8c8d] mt-4">
          Don’t have an account?{' '}
          <Link to="/register" className="text-[#1abc9c] hover:text-[#16a085] font-semibold transition duration-200">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;