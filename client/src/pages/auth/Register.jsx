import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Register = () => {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('student');  // Set default role as 'student'
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      
      if (response.data.token) {
        login(response.data.token);
        setSuccessMessage('Registration Successful! Please log in.');
        setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error("Registration Error:", err.response?.data || err.message);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow-lg w-80" onSubmit={handleRegister}>
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </div>
        {/* Remove role selection, as it's set to default 'student' */}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
