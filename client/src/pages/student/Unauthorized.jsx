import React from 'react';
import { motion } from 'framer-motion';
import { BiLockAlt } from 'react-icons/bi'; // Using react-icons for a lock icon

const Unauthorized = () => {
  const palette = {
    primary: '#2c3e50',
    accent: '#e74c3c', // Red for warning
    muted: '#7f8c8d',
    bg: '#f4f7fa',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa] px-4">
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Lock Icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BiLockAlt size={64} className="text-[#e74c3c]" />
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#2c3e50] mb-4">Access Denied</h1>

        {/* Message */}
        <p className="text-[#7f8c8d] text-lg mb-6">
          Unauthorized: This page is restricted to students only. Please log in with appropriate
          credentials or contact support if you believe this is an error.
        </p>

        {/* Action Button */}
        <motion.button
          onClick={() => window.location.href = '/'} // Redirect to login
          className="bg-[#e74c3c] hover:bg-[#c0392b] text-white px-6 py-3 rounded-md font-semibold transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Return to Login
        </motion.button>

        
      </motion.div>
    </div>
  );
};

export default Unauthorized;