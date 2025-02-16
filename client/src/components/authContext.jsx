import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing authentication status and user info
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("userInfo");

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Auto logout based on token expiry
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const expiryTime = JSON.parse(atob(token.split(".")[1])).exp * 1000; // Decode JWT
        const timeLeft = expiryTime - Date.now();

        if (timeLeft > 0) {
          const timeout = setTimeout(logout, timeLeft); // Set auto logout timer
          return () => clearTimeout(timeout); // Clear timeout on component unmount
        } else {
          logout(); // Immediately logout if token is expired
        }
      } catch (error) {
        console.error("Invalid token format:", error);
        logout(); // Logout on token parsing error
      }
    }
  }, []);

  const login = (userInfo) => {
    // Save token and user info to localStorage
    localStorage.setItem("authToken", "your-auth-token"); // Replace with actual token
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    setIsAuthenticated(true);
    setUser(userInfo);
  };

  const logout = () => {
    // Clear token and user info from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
