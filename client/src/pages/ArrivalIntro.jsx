import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Letter-by-letter animation component with optional spacing
const animateLetters = (text, showAll, addSpacing = false) => {
  return text.split('').map((letter, index) => (
    <span
      key={index}
      className={`inline-block ${showAll ? 'opacity-100' : 'opacity-0'} animate-fadeIn`}
      style={{
        animationDelay: `${index * 100}ms`,
        marginRight: addSpacing && letter !== ' ' ? '4px' : '0px', // Add spacing between letters, not spaces
      }}
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
    }, 3000); // Redirect after 3 seconds

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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#2C2C2C] to-[#1A1A1A]">
      {/* Background UI combining Login and lines */}
      <div className="absolute inset-0">
        {/* Animated background particles from Login */}
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

        {/* Glowing orb effect from Login */}
        <motion.div
          className="absolute top-[-200px] left-[-200px] w-[400px] h-[400px] bg-[#00D4FF] rounded-full blur-3xl opacity-20"
          animate={{ opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Animated Lines from previous ArrivalIntro */}
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center">
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
          {animateLetters('Library Management System', showAll, true)}
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