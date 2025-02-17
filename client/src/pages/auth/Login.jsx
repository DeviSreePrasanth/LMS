import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
        console.log('User role:', response.data.user.role);  // Correctly accessed
        console.log('User email:', response.data.user.email);  // Correctly accessed

        login(response.data.token);
        
        // Assuming the response contains the role of the user, you can route based on the role
        const userRole = response.data.user.role;
        if (userRole === 'librarian') {
            navigate('/librarian/dashboard'); // Redirect to librarian dashboard
        } else if (userRole === 'student') {
            navigate('/student/dashboard'); // Redirect to student dashboard
        } else {
            navigate('/'); // Default route
        }
    } catch (err) {
        setError('Invalid credentials');
    }
};


  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow-lg w-80" onSubmit={handleLogin}>
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
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
        <div className="mb-6">
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
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
