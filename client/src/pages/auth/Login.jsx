import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Function to decode JWT token (unchanged)
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // Start loading
    
    try {
      const loginResponse = await axios.post(
        "https://lms-o44p.onrender.com/api/auth/login",
        {
          email,
          password,
          studentId,
        }
      );
      
      const { token, user } = loginResponse.data;
      if (!token || !user) {
        throw new Error("Invalid server response: missing token or user data");
      }

      const decodedToken = decodeToken(token);
      const userEmail = user.email || decodedToken?.email || email;

      const userData = {
        id: user.id,
        email: userEmail,
        role: user.role,
        studentId: user.studentId || studentId,
      };

      await login(token, userData);

      if (user.role === "student" && !studentId) {
        throw new Error("Student ID is required for students");
      }

      // Success animation before navigation
      switch (user.role) {
        case "student":
          navigate("/student/dashboard");
          break;
        case "librarian":
          navigate("/librarian/dashboard");
          break;
        default:
          navigate("/unauthorized");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Invalid credentials or server error"
      );
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const palette = {
    primary: "#2c3e50",
    accent: "#1abc9c",
    muted: "#7f8c8d",
    bg: "#f4f7fa",
    headerBg: "#1f2937",
  };

  // Button variants for animation
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    loading: { 
      scale: [1, 1.05, 1],
      transition: { 
        repeat: Infinity,
        duration: 0.8 
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa] px-4">
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Login animation background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#1abc9c] to-[#16a085] opacity-0"
          initial={false}
          animate={isLoading ? { opacity: 0.2 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        <h2 className="text-3xl font-bold text-center text-[#2c3e50] mb-6 relative z-10">
          Login
        </h2>

        <AnimatePresence>
          {error && (
            <motion.p
              className="text-red-500 text-sm text-center mb-4 relative z-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#7f8c8d] mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label
              htmlFor="studentId"
              className="block text-sm font-medium text-[#7f8c8d] mb-2"
            >
              Student ID (Students Only)
            </label>
            <input
              type="text"
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
              placeholder="Enter your student ID"
              disabled={isLoading}
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#7f8c8d] mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] transition duration-200 text-[#2c3e50] bg-[#f4f7fa]"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </motion.div>

          <motion.button
            type="submit"
            className="w-full bg-[#1abc9c] text-white p-3 rounded-md transition duration-300 ease-in-out font-semibold flex items-center justify-center"
            variants={buttonVariants}
            initial="initial"
            whileHover={!isLoading && "hover"}
            whileTap={!isLoading && "tap"}
            animate={isLoading ? "loading" : "initial"}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>

        <p className="text-center text-[#7f8c8d] mt-4 relative z-10">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#1abc9c] hover:text-[#16a085] font-semibold transition duration-200"
          >
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;