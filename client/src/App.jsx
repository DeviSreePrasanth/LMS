import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import AddBook from "./components/AddBook";
import AddTransaction from "./components/AddTransaction";
import SearchStudent from "./components/SearchStudent";
import AddStudent from "./components/AddStudent";
import ReturnBook from "./components/ReturnBook";
import Home from "./components/Home";
import Signup from "./components/Signup";
import BookList from "./components/BookList";
import Login from "./components/Login";

const App = () => {
  return (
    <Router>
      {/* Router will handle navigation */}
      <Routes>
        {/* Define your routes using Routes */}
        {/* Public routes */}
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/add-transaction" element={<AddTransaction />} />
        <Route path="/search-student" element={<SearchStudent />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/return-book" element={<ReturnBook />} />
        <Route path="/books" element={<BookList />} />
      </Routes>
    </Router>
  );
};

export default App;
