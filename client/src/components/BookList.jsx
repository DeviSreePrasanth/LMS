import React, { useEffect, useState } from 'react';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
    if (!bookId) {
      setError('Invalid book ID for deletion.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete book');
      }

      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
    } catch (err) {
      setError(`Error deleting book: ${err.message}`);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book._id);
    setEditData(book);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editingBook || !editData) {
      setError('Incomplete edit data.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/books/${editingBook}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error('Failed to update book');
      }

      const updatedBook = await response.json();

      setBooks((prevBooks) =>
        prevBooks.map((book) => (book._id === editingBook ? updatedBook : book))
      );

      setEditingBook(null);
      setEditData({});
    } catch (err) {
      setError(`Error updating book: ${err.message}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Book List</h2>
      {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}
      {!books.length ? (
        <p className="text-center text-gray-500">No books available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Author</th>
                <th className="py-3 px-4 text-left">Genre</th>
                <th className="py-3 px-4 text-left">Published Year</th>
                <th className="py-3 px-4 text-center">Available</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr
                  key={book._id}
                  className="hover:bg-gray-100 border-b transition duration-300 ease-in-out"
                >
                  <td className="py-2 px-4">
                    {editingBook === book._id ? (
                      <input
                        type="text"
                        name="title"
                        value={editData.title}
                        onChange={handleEditChange}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      book.title
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editingBook === book._id ? (
                      <input
                        type="text"
                        name="author"
                        value={editData.author}
                        onChange={handleEditChange}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      book.author
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editingBook === book._id ? (
                      <input
                        type="text"
                        name="genre"
                        value={editData.genre}
                        onChange={handleEditChange}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      book.genre
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editingBook === book._id ? (
                      <input
                        type="number"
                        name="publishedYear"
                        value={editData.publishedYear}
                        onChange={handleEditChange}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      book.publishedYear
                    )}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {book.available ? 'Yes' : 'No'}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {editingBook === book._id ? (
                      <>
                        <button
                          onClick={handleEditSubmit}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingBook(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(book)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookList;
