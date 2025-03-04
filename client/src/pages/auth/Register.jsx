import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import libb from './libb.jpg';

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
        "https://lms-o44p.onrender.com/api/auth/register",
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

  const inputVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#2C2C2C] to-[#1A1A1A]">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#00D4FF] rounded-full opacity-20"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.5, 0.2],
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
      <div className="absolute top-[-200px] left-[-200px] w-[400px] h-[400px] bg-[#00D4FF] rounded-full blur-3xl opacity-20 animate-pulse" />

      <motion.div
        className="relative z-10 flex items-center justify-center min-h-screen px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="bg-[#2C2C2C]/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden border border-[#00D4FF]/50"
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          {/* Left Half - Library Image with Wave Separator (Hidden on Mobile) */}
          <motion.div
            className="hidden md:block relative w-full md:w-1/2"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src={libb}
              alt="Library Interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 to-transparent flex items-end p-6">
              <motion.p
                className="text-[#FFFFFF] text-lg font-semibold"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Discover Endless Learning
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
                  fill="#2C2C2C"
                  fillOpacity="1"
                  d="M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,197.3C672,213,768,235,864,229.3C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
              </svg>
            </div>
          </motion.div>

          {/* Right Half - Form (Full Width on Mobile) */}
          <div className="w-full p-8 relative">
            <motion.h2
              className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#FF007A] mb-6"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join Today
            </motion.h2>

            <AnimatePresence>
              {successMessage && (
                <motion.div
                  className="bg-[#00D4FF]/20 border-l-4 border-[#00D4FF] text-[#00D4FF] p-3 mb-4 rounded-r-lg"
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
                  className="bg-[#FF007A]/20 border-l-4 border-[#FF007A] text-[#FF007A] p-3 mb-4 rounded-r-lg"
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
                <label
                  className="block text-sm font-medium text-[#FFFFFF] mb-2"
                  style={{ textShadow: "0 0 10px #00D4FF" }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-[#333333] border border-[#00D4FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent transition-all duration-300 text-[#FFFFFF] hover:bg-[#444444]"
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
                <label
                  className="block text-sm font-medium text-[#FFFFFF] mb-2"
                  style={{ textShadow: "0 0 10px #00D4FF" }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-[#333333] border border-[#00D4FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent transition-all duration-300 text-[#FFFFFF] hover:bg-[#444444]"
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
                <label
                  className="block text-sm font-medium text-[#FFFFFF] mb-2"
                  style={{ textShadow: "0 0 10px #00D4FF" }}
                >
                  Student ID
                </label>
                <input
                  type="text"
                  id="studentId"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full p-3 bg-[#333333] border border-[#00D4FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent transition-all duration-300 text-[#FFFFFF] hover:bg-[#444444]"
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
                <label
                  className="block text-sm font-medium text-[#FFFFFF] mb-2"
                  style={{ textShadow: "0 0 10px #00D4FF" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-[#333333] border border-[#00D4FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent transition-all duration-300 text-[#FFFFFF] hover:bg-[#444444]"
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                />
              </motion.div>

              <button
                type="submit"
                className="w-full bg-[#00D4FF] text-[#FFFFFF] p-3 rounded-lg font-semibold flex items-center justify-center shadow-lg hover:bg-[#FF007A] transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#FFFFFF]"
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
                    Processing...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            <motion.p
              className="text-center text-[#FFFFFF] mt-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Already have an account?{" "}
              <Link
                to="/"
                className="text-[#00D4FF] hover:text-[#FF007A] font-medium transition-all duration-200 relative group"
              >
                Sign in
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00D4FF] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;