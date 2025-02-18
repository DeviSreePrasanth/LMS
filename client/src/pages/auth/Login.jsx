import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log('User role:', response.data.user.role);
      console.log('User email:', response.data.user.email);

      login(response.data.token);

      const userRole = response.data.user.role;
      if (userRole === 'librarian') {
        navigate('/librarian/dashboard');
      } else if (userRole === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <form className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-6" onSubmit={handleLogin}>
        <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
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
          Login
        </button>
        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
