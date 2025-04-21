import React from 'react';
import { useNavigate } from 'react-router-dom';
import desktopBg from '../assets/dd.png'; // Desktop background image
import mobileBg from '../assets/mobile.png'; // Mobile background image (replace with your actual mobile image path)

const IntroPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/register');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-start md:justify-start px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
      {/* Background Images - Different for mobile and desktop */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Mobile Background (shown on screens smaller than md) */}
        <div className="md:hidden absolute inset-0 bg-cover bg-center"
             style={{ backgroundImage: `url(${mobileBg})` }}>
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>
        
        {/* Desktop Background (shown on md screens and larger) */}
        <div className="hidden md:block absolute inset-0 bg-cover bg-[60%_center] md:bg-center"
             style={{ backgroundImage: `url(${desktopBg})` }}>
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center md:items-start justify-between md:justify-start min-h-screen md:min-h-0 w-full max-w-md md:max-w-xl lg:max-w-2xl">
        {/* Heading - Visible only on mobile (below md) */}
        <h1 className="text-4xl xs:text-5xl sm:text-6xl text-[#083069] font-bold leading-tight text-center md:hidden mt-8">
          Welcome to<br />Library<br />Management<br />System
        </h1>

        {/* Spacer to push buttons to the bottom on mobile only */}
        <div className="flex-grow md:hidden"></div>

        {/* Buttons Container */}
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4 w-full md:w-auto mb-8 md:mb-0 md:mt-8">
          {/* Login Button */}
          <button
            onClick={handleLoginClick}
            className="md:mt-66 bg-purple-600 text-white font-semibold py-3 px-8 xs:py-4 xs:px-10 md:py-3 md:px-8 rounded-full hover:bg-purple-700 transition duration-300 text-base xs:text-lg sm:text-xl md:text-2xl shadow-lg w-full md:w-auto"
          >
            Login
          </button>

          {/* Sign up Button */}
          <button
            onClick={handleSignUpClick}
            className="md:mt-66 bg-transparent border-2 border-purple-600 text-purple-600 font-semibold py-3 px-8 xs:py-4 xs:px-10 md:py-3 md:px-8 rounded-full hover:bg-purple-600 hover:text-white transition duration-300 text-base xs:text-lg sm:text-xl md:text-2xl shadow-lg w-full md:w-auto"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;