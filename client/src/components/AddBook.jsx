import React, { useState } from "react";

const AddBook = () => {
  const [book, setBook] = useState({
    title: "",
    author: "",
    genre: "",
    publishedYear: "",
    available: true,
  });

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBook({
      ...book,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!book.title || !book.author || !book.genre || !book.publishedYear) {
      setError("Please fill in all required fields");
      return;
    }

    if (
      isNaN(book.publishedYear) ||
      book.publishedYear < 1000 ||
      book.publishedYear > new Date().getFullYear()
    ) {
      setError("Published year must be a valid year");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add book");
      }

      setMessage("Book added successfully!");
      setError(null);

      setBook({
        title: "",
        author: "",
        genre: "",
        publishedYear: "",
        available: true,
      });
    } catch (err) {
      setError(err.message || "Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Book</h2>
      {message && (
        <p className="text-green-600 mb-4 border border-green-600 rounded p-2">
          {message}
        </p>
      )}
      {error && (
        <p className="text-red-600 mb-4 border border-red-600 rounded p-2">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700">
            Title:
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={book.title || ""}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="author" className="block text-gray-700">
            Author:
          </label>
          <input
            id="author"
            type="text"
            name="author"
            value={book.author || ""}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="genre" className="block text-gray-700">
            Genre:
          </label>
          <input
            id="genre"
            type="text"
            name="genre"
            value={book.genre || ""}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="publishedYear" className="block text-gray-700">
            Published Year:
          </label>
          <input
            id="publishedYear"
            type="number"
            name="publishedYear"
            value={book.publishedYear || ""}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <input
            id="available"
            type="checkbox"
            name="available"
            checked={book.available}
            onChange={handleChange}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="available" className="text-gray-700">
            Available
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          {loading ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
