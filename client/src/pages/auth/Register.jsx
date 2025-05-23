import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import libb from "./libb.jpg";

const Register = () => {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [role] = useState("student");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://lmsbackend-six.vercel.app/api/auth/register",
        {
          name,
          email,
          password,
          studentId,
          role,
        }
      );

      if (response.data.token) {
        login(response.data.token, {
          id: response.data.user.id,
          email: response.data.user.email,
          role: response.data.user.role,
          studentId: response.data.user.studentId,
        });
        setSuccessMessage(
          "Registration successful! Redirecting to dashboard..."
        );
        setTimeout(() => navigate("/student/dashboard"), 1500);
      } else {
        throw new Error("Registration failed: No token received");
      }
    } catch (err) {
      console.error("Registration Error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Input animation variants (matching Login)
  const inputVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#e0e0e0]">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#800080] rounded-full opacity-10"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Glowing orb effect */}
      <div className="absolute top-[-200px] left-[-200px] w-[400px] h-[400px] bg-[#800080] rounded-full blur-3xl opacity-10 animate-pulse" />

      <motion.div
        className="relative z-10 flex items-center justify-center min-h-screen px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden border border-[#800080]/30 md:bg-none"
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          {/* Left Half - Library Image with Wave Separator (Only in Desktop) */}
          <div className="hidden md:block relative w-full md:w-1/2">
            <img
              src={libb}
              alt="Library Interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-end p-6">
              <motion.p
                className="text-[#1E3A8A] text-lg font-semibold"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Welcome to Your Library Journey
              </motion.p>
            </div>
            {/* Wave Separator */}
            <div className="absolute bottom-0 md:bottom-auto md:right-0 w-full h-24 md:w-24 md:h-full">
              <svg
                className="w-full h-full md:rotate-90"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
              >
                <path
                  fill="#f5f5f5"
                  fillOpacity="1"
                  d="M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,197.3C672,213,768,235,864,229.3C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
              </svg>
            </div>
          </div>

          {/* Form Section (Full Width on Mobile without Background Image, Solid Background on Desktop) */}
          <div className="relative w-full p-8 md:p-8 md:w-1/2 md:bg-white md:backdrop-blur-md bg-white/90">
            <motion.h2
              className="relative text-3xl font-extrabold text-center text-[#1E3A8A] mb-6"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Register
            </motion.h2>

            <AnimatePresence>
              {successMessage && (
                <motion.div
                  className="relative bg-[#800080]/20 border-l-4 border-[#800080] text-[#800080] p-3 mb-4 rounded-r-lg"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <p>{successMessage}</p>
                </motion.div>
              )}
              {error && (
                <motion.div
                  className="relative bg-[#ffcccc]/20 border-l-4 border-[#800080] text-[#800080] p-3 mb-4 rounded-r-lg"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleRegister} className="space-y-5">
              <motion.div
                variants={inputVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
              >
                <label className="relative block text-sm font-medium text-[#1E3A8A] mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="relative w-full p-3 bg-[#f5f5f5] border border-[#800080] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800080] focus:border-transparent transition-all duration-300 text-[#1E3A8A] hover:bg-[#e0e0e0]"
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                />
              </motion.div>

              <motion.div
                variants={inputVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.3 }}
              >
                <label className="relative block text-sm font-medium text-[#1E3A8A] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative w-full p-3 bg-[#f5f5f5] border border-[#800080] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800080] focus:border-transparent transition-all duration-300 text-[#1E3A8A] hover:bg-[#e0e0e0]"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </motion.div>

              <motion.div
                variants={inputVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.4 }}
              >
                <label className="relative block text-sm font-medium text-[#1E3A8A] mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  id="studentId"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="relative w-full p-3 bg-[#f5f5f5] border border-[#800080] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800080] focus:border-transparent transition-all duration-300 text-[#1E3A8A] hover:bg-[#e0e0e0]"
                  placeholder="Enter your student ID"
                  required
                  disabled={isLoading}
                />
              </motion.div>

              <motion.div
                variants={inputVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.5 }}
              >
                <label className="relative block text-sm font-medium text-[#1E3A8A] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative w-full p-3 bg-[#f5f5f5] border border-[#800080] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800080] focus:border-transparent transition-all duration-300 text-[#1E3A8A] hover:bg-[#e0e0e0]"
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                />
              </motion.div>

              <button
                type="submit"
                className="relative w-full bg-[#800080] text-white p-3 rounded-lg font-semibold flex items-center justify-center shadow-lg hover:bg-[#6A006A] transition-all duration-300"
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
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            <motion.p
              className="relative text-center text-[#4682B4] mt-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#800080] hover:text-[#6A006A] font-medium transition-all duration-200 relative group"
              >
                Sign in
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#800080] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
