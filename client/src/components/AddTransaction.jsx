import React, { useState } from 'react';
import axios from 'axios';

const AddTransaction = () => {
  const [transactionData, setTransactionData] = useState({
    title: '',
    author: '',
    studentName: '',
    transactionDate: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setTransactionData({ ...transactionData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Transaction Data:', transactionData); // Log before sending

    // Frontend validation
    const { title, author, studentName, transactionDate } = transactionData;
    if (!title || !author || !studentName || !transactionDate) {
      setMessage('All fields are required.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/transactions/add',
        transactionData
      );
      setMessage(response.data.message);

      // Reset the form
      setTransactionData({
        title: '',
        author: '',
        studentName: '',
        transactionDate: '',
      });
    } catch (error) {
      // Logging the error for debugging
      console.error('Error:', error);
      if (error.response) {
        setMessage(error.response.data.message || 'Error adding transaction.');
      } else {
        setMessage('Error connecting to the server.');
      }
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h3 className="text-2xl font-bold mb-6 text-purple-700">Add Transaction</h3>
      
      {message && (
        <p className="mb-4 text-center text-red-600">{message}</p>
      )}

      <form 
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <input
          type="text"
          name="title"
          placeholder="Book Name"
          value={transactionData.title}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          name="author"
          placeholder="Author Name"
          value={transactionData.author}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          name="studentName"
          placeholder="Student Name"
          value={transactionData.studentName}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="date"
          name="transactionDate"
          value={transactionData.transactionDate}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button 
          type="submit"
          className="w-full p-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300"
        >
          Add Transaction
        </button>
      </form>
    </section>
  );
};

export default AddTransaction;
