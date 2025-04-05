import React, { useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AddStudent = ({ setActiveSection }) => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        "https://lms-o44p.onrender.com/api/auth/register",
        formData
      );
      setSuccess("Student added successfully! Redirecting...");
      setFormData({
        name: "",
        email: "",
        studentId: "",
        password: "",
        role: "student",
      });

      if (response.data.token) {
        login(response.data.token, {
          id: response.data.user.id,
          email: response.data.user.email,
          role: response.data.user.role,
          studentId: response.data.user.studentId,
        });
      }

      setTimeout(
        () =>
          setActiveSection
            ? setActiveSection("students")
            : navigate("/students"),
        1000
      );
    } catch (err) {
      console.error("Add Student Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to add student");
      setSuccess(null);
    }
  };

  const palette = {
    primary: "#2c3e50",
    accent: "#1abc9c",
    muted: "#7f8c8d",
    bg: "#f4f7fa",
    headerBg: "#1f2937",
  };

  return (
    <motion.div
      className="p-4 sm:p-6 bg-[#f4f7fa] min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-md sm:max-w-lg mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-[#2c3e50]">
          Add New Student
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 text-sm sm:text-base">
            Error: {error}
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
              htmlFor="name"
              className="block text-[#7f8c8d] text-sm sm:text-base font-medium mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa] text-sm sm:text-base"
              placeholder="Enter full name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-[#7f8c8d] text-sm sm:text-base font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa] text-sm sm:text-base"
              placeholder="Enter email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="studentId"
              className="block text-[#7f8c8d] text-sm sm:text-base font-medium mb-2"
            >
              Student ID
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa] text-sm sm:text-base"
              placeholder="Enter student ID"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-[#7f8c8d] text-sm sm:text-base font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa] text-sm sm:text-base"
              placeholder="Enter password"
              required
            />
          </div>
          <motion.button
            type="submit"
            className="w-full bg-[#059669] hover:bg-[#047857] text-white p-2 sm:p-3 rounded-md transition duration-200 text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Student
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};
export default AddStudent;
