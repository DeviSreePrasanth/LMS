import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
  const [loading, setLoading] = useState(!!localStorage.getItem('token')); // Initial loading based on token presence
  const [error, setError] = useState(null);

  // Verify access token
  const verifyToken = useCallback(async (accessToken) => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/verify', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setToken(accessToken);
      setUser(response.data.user);
      setError(null);
      return true;
    } catch (err) {
      console.error('Token verification failed:', err.response?.data || err.message);
      return false;
    }
  }, []);

  // Refresh access token using refresh token
  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/refresh', {
        refreshToken: localStorage.getItem('refreshToken'),
      });
      const { token: newToken, refreshToken: newRefreshToken } = response.data;

      localStorage.setItem('token', newToken);
      if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken); // Update if provided
      setToken(newToken);
      setError(null);

      // Verify the new token
      const isValid = await verifyToken(newToken);
      if (!isValid) throw new Error('New token verification failed');
    } catch (err) {
      console.error('Refresh token failed:', err.response?.data || err.message);
      setError('Session expired. Please log in again.');
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  }, [verifyToken]);

  // Check token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        const isValid = await verifyToken(storedToken);
        if (!isValid) {
          await refreshAccessToken(); // Try refreshing if initial token is invalid
        }
      } else {
        setLoading(false); // No token, no need to verify
      }
    };

    initializeAuth();
  }, [verifyToken, refreshAccessToken]);

  const login = useCallback(async (newToken, userData, newRefreshToken) => {
    if (!newToken || !userData) {
      setError('Login failed: Missing token or user data');
      return false;
    }

    try {
      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken || refreshToken); // Store refresh token
      setToken(newToken);
      setRefreshToken(newRefreshToken || refreshToken);
      setUser(userData);
      setError(null);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to set login state');
      return false;
    }
  }, [refreshToken]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setError(null);
    setLoading(false);
  }, []);

  const refreshAuth = useCallback(() => {
    setLoading(true);
    refreshAccessToken();
  }, [refreshAccessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        error,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };