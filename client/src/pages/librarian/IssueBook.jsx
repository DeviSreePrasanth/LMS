import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const IssueBook = ({ setActiveSection }) => {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    bookName: "",
    bid: "",
    dueDate: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await axios.get(
          "https://lms-o44p.onrender.com/api/students"
        );
        setStudents(studentsResponse.data);

        const booksResponse = await axios.get(
          "https://lms-o44p.onrender.com/api/books"
        );
        setBooks(booksResponse.data);
      } catch (err) {
        setError("Failed to fetch students or books");
      }
    };
    fetchData();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "studentName") {
      const selectedStudent = students.find(
        (student) => student.name === value
      );
      setFormData((prev) => ({
        ...prev,
        studentName: value,
        studentId: selectedStudent ? selectedStudent._id : "",
      }));
    } else if (name === "bookName") {
      const selectedBook = books.find((book) => book.title === value);
      setFormData((prev) => ({
        ...prev,
        bookName: value,
        bid: selectedBook ? String(selectedBook.bid) : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const submitData = {
      studentId: formData.studentId,
      bid: formData.bid,
      dueDate: formData.dueDate,
    };

    console.log("Submitting issue book data:", submitData);

    try {
      const response = await axios.post(
        "https://lms-o44p.onrender.com/api/loans",
        submitData
      );
      setSuccess("Book issued successfully!");
      setFormData({
        studentName: "",
        studentId: "",
        bookName: "",
        bid: "",
        dueDate: "",
      });
      setTimeout(() => setActiveSection("students"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to issue book");
      console.error("Error details:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const palette = {
    primary: "#2c3e50",
    accent: "#1abc9c",
    muted: "#7f8c8d",
    bg: "#f4f7fa",
  };

  return (
    <motion.div
      className="p-4 sm:p-6 bg-[#f4f7fa] min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-[#2c3e50]">
          Issue Book
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 text-sm sm:text-base">
            {error}
          </p>
        )}
        {success && (
          <p className="text-[#1abc9c] text-center mb-4 text-sm sm:text-base">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="studentName"
              className="block text-[#7f8c8d] text-sm sm:text-base font-medium mb-2"
            >
              Student Name
            </label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              list="studentsList"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa] text-sm sm:text-base"
              placeholder="Type student name"
              required
            />
            <datalist id="studentsList">
              {students.map((student) => (
                <option key={student._id} value={student.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label
              htmlFor="bookName"
              className="block text-[#7f8c8d] text-sm sm:text-base font-medium mb-2"
            >
              Book Name
            </label>
            <input
              type="text"
              id="bookName"
              name="bookName"
              value={formData.bookName}
              onChange={handleChange}
              list="booksList"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa] text-sm sm:text-base"
              placeholder="Type book name"
              required
            />
            <datalist id="booksList">
              {books.map((book) => (
                <option key={book._id} value={book.title} />
              ))}
            </datalist>
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-[#7f8c8d] text-sm sm:text-base font-medium mb-2"
            >
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa] text-sm sm:text-base"
              required
            />
          </div>

          <motion.button
            type="submit"
            className={`w-full bg-[#059669] hover:bg-[#047857] text-white p-2 sm:p-3 rounded-md transition duration-200 text-sm sm:text-base ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            disabled={loading}
          >
            {loading ? "Issuing..." : "Issue Book"}
          </motion.button>

          <motion.button
            onClick={() => setActiveSection("students")}
            className="w-full bg-gray-200 hover:bg-gray-300 text-[#2c3e50] p-2 sm:p-3 rounded-md transition duration-200 text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Students
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default IssueBook;
