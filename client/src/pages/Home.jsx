import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <>
      <Navbar />
      <div 
        className="flex items-center justify-center text-center bg-cover bg-center h-screen text-white px-5" 
        style={{ 
          backgroundImage: "url('https://files.oaiusercontent.com/file-9MVc75ZjMiKHSBgQD24EqH?se=2025-02-16T12%3A14%3A00Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Da0fc590e-e855-40d3-90a8-cb7951daa7d9.webp&sig=3xN%2Bt02yCU1Yw0EHstyuHKT0o2kUOAHkyuqwbkkd%2Bzc%3D')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-xl bg-transparent backdrop-blur-md p-8 rounded-2xl shadow-lg">
          <h1 className="text-5xl font-bold mb-3 drop-shadow-lg">Welcome to the Library</h1>
          <p className="text-lg mb-5 drop-shadow-md">Explore a world of knowledge and adventure through our extensive collection of books and resources.</p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition duration-300">Explore</button>
            <button className="px-6 py-3 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition duration-300">Search</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
