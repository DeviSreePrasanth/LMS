import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('librarian'); // Add role as 'librarian' by default
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        await axios.post('http://localhost:5000/api/auth/register', { 
            name, 
            email, 
            password, 
            role 
        });
        alert('Registration successful! Please login.');
    } catch (err) {
        console.error(err.response.data);
        setError('Registration failed. Try again.');
    }
};

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow-lg w-80" onSubmit={handleRegister}>
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
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
        <div className="mb-4">
          <label htmlFor="role" className="block text-sm">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 mt-1 border rounded"
            required
          >
            <option value="librarian">Librarian</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
