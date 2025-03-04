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
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  // Automatically navigate to the login page after 5 seconds and show animation after 2 seconds
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowAll(true);
    }, 2000); // Start animation after 2 seconds

    const redirectTimer = setTimeout(() => {
      navigate("/login");
    }, 5000); // 5000ms = 5 seconds

    return () => {
      clearTimeout(showTimer);
      clearTimeout(redirectTimer);
    }; // Cleanup timers on component unmount
  }, [navigate]);

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

      {/* Intro Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* LMS Text with Letter-by-Letter Animation */}
        <h1
          className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#FF007A]"
          style={{ textShadow: "0 0 10px #00D4FF, 0 0 20px #FF007A" }}
        >
          {animateLetters('LMS', showAll)}
        </h1>

        {/* Library Management System Text with Letter-by-Letter Animation */}
        <p
          className="text-xl md:text-2xl text-[#FFFFFF] mt-4"
          style={{ textShadow: "0 0 5px #00D4FF" }}
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