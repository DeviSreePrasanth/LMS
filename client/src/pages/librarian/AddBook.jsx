import React, { useState } from 'react';
import axios from 'axios';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [error, setError] = useState('');

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/books', { title, author, isbn });
      alert('Book added successfully!');
    } catch (err) {
      setError('Failed to add book. Try again.');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold mb-6">Add New Book</h2>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleAddBook}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm">Book Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="author" className="block text-sm">Author</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="isbn" className="block text-sm">ISBN</label>
          <input
            type="text"
            id="isbn"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
