import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AddBook from './pages/librarian/AddBook';
import BookList from './pages/librarian/BookList';
import Students from './pages/librarian/Students';
import AddStudent from './pages/librarian/AddStudent';
import StudentBookList from './pages/student/BookList';
import StudentDashboard from './pages/student/Dashboard';
import LibrarianDashboard from './pages/librarian/Dashboard';
import { AuthProvider } from './context/AuthContext';
import BorrowedBooks from './pages/student/BorrowedBooks';
import ArrivalIntro from './pages/ArrivalIntro';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ArrivalIntro/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Librarian Routes */}
          <Route path="/librarian/dashboard" element={<LibrarianDashboard />} />
          <Route path="/librarian/addbook" element={<AddBook />} />
          <Route path="/librarian/booklist" element={<BookList />} />
          <Route path="/librarian/students" element={<Students />} />
          <Route path="/librarian/addstudent" element={<AddStudent />} /> {/* New route */}
          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/booklist" element={<StudentBookList />} />
          <Route path="/student/details" element={ <BorrowedBooks/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;