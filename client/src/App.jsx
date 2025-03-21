import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AddBook from './pages/librarian/AddBook';
import BookList from './pages/librarian/BookList';
import Students from './pages/librarian/Students';
import AddStudent from './pages/librarian/AddStudent';
import StudentBookList from './pages/student/BookList';
import StudentDashboard from './pages/student/Dashboard';
import LibrarianDashboard from './pages/librarian/Dashboard';
import { AuthProvider, AuthContext } from './context/AuthContext'; // Import AuthContext
import BorrowedBooks from './pages/student/BorrowedBooks';
import ArrivalIntro from './pages/ArrivalIntro';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children, role }) => {
  const { user, loading } = React.useContext(AuthContext); // Use context directly

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while verifying token
  }

  if (!user) {
    return <Navigate to="/login" />; // Redirect to login if no user
  }

  // Check role if specified (assuming user.role exists in your user object)
  if (role && user.role !== role) {
    return <Navigate to="/" />; // Redirect to home if role doesn’t match
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ArrivalIntro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Librarian Protected Routes */}
          <Route
            path="/librarian/dashboard"
            element={
              <PrivateRoute role="librarian">
                <LibrarianDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/librarian/addbook"
            element={
              <PrivateRoute role="librarian">
                <AddBook />
              </PrivateRoute>
            }
          />
          <Route
            path="/librarian/booklist"
            element={
              <PrivateRoute role="librarian">
                <BookList />
              </PrivateRoute>
            }
          />
          <Route
            path="/librarian/students"
            element={
              <PrivateRoute role="librarian">
                <Students />
              </PrivateRoute>
            }
          />
          <Route
            path="/librarian/addstudent"
            element={
              <PrivateRoute role="librarian">
                <AddStudent />
              </PrivateRoute>
            }
          />

          {/* Student Protected Routes */}
          <Route
            path="/student/dashboard"
            element={
              <PrivateRoute role="student">
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/booklist"
            element={
              <PrivateRoute role="student">
                <StudentBookList />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/details"
            element={
              <PrivateRoute role="student">
                <BorrowedBooks />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;