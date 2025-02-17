import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentBookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axios.get('http://localhost:5000/api/books');
      setBooks(response.data);
    };
    fetchBooks();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold mb-6">Available Books</h2>
      <ul>
        {books.map((book) => (
          <li key={book._id}>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p>{book.isbn}</p>
            <button className="bg-blue-600 text-white p-2 rounded">Get Book</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentBookList;
