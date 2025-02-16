const React = require('react');
const { Navigate } = require('react-router-dom');
const jwt_decode = require('jwt-decode');

const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (err) {
      console.error('Invalid token:', err);
      return false;
    }
  }
  return false;
};

const ProtectedRoute = ({ element: Element }) => {
  return isAuthenticated() ? <Element /> : <Navigate to="/" />;
};

module.exports = ProtectedRoute;
