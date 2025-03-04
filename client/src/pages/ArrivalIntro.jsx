import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Letter-by-letter animation component
const animateLetters = (text, showAll) => {
  return text.split('').map((letter, index) => (
    <span
      key={index}
      className={`inline-block ${showAll ? 'opacity-100' : 'opacity-0'} animate-fadeIn`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {letter}
    </span>
  ));
};

const ArrivalIntro = () => {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAll(true);
    }, 100); // Start animation almost immediately

    const redirectTimer = setTimeout(() => {
      navigate("/login");
    }, 9000); // Redirect after 3 seconds

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  // Animation variants for text transition from left to right (for LMS only)
  const textVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="bg-black w-screen h-screen flex items-center justify-center relative overflow-hidden">
      {/* Professional Background UI */}
      <div className="absolute inset-0">
        {/* Subtle Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-900/20"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Animated Lines for Professional Touch */}
        <motion.div
          className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
          animate={{ x: [-1000, 1000] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"
          animate={{ x: [1000, -1000] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <motion.p
          className="text-yellow-400 text-6xl font-bold"
          style={{ fontFamily: "'Inter', sans-serif" }}
          variants={textVariants}
          initial="hidden"
          animate={showAll ? "visible" : "hidden"}
        >
          LMS
        </motion.p>

        <p
          className="text-cyan-300 text-xl mt-4 font-medium"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {animateLetters('Library Management System', showAll)}
        </p>
      </div>

      {/* CSS Animation Definition */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ArrivalIntro;