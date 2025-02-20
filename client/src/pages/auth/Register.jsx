import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Register = () => {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('student');  // Default role as 'student'
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      
      if (response.data.token) {
        login(response.data.token);
        setSuccessMessage('Registration Successful! Redirecting to login...');
        setTimeout(() => navigate('/student/dashboard'), 1000);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error("Registration Error:", err.response?.data || err.message);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <form className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-6" onSubmit={handleRegister}>
        <h2 className="text-3xl font-bold text-center text-gray-800">Register</h2>
        {successMessage && <p className="text-green-600 text-sm text-center">{successMessage}</p>}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition duration-300 ease-in-out"
        >
          Register
        </button>
        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
