import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || null
  );
  const [loading, setLoading] = useState(!!localStorage.getItem("token")); // Start loading if token exists
  const [error, setError] = useState(null);

  const verifyToken = useCallback(async (accessToken) => {
    try {
      const response = await axios.get(
        "https://lmsbackend-six.vercel.app/api/auth/verify",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setToken(accessToken);
      setUser(response.data.user);
      setError(null);
      return true;
    } catch (err) {
      console.error(
        "Token verification failed:",
        err.response?.data || err.message
      );
      setError("Unable to verify session. Please try refreshing.");
      return false;
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (!storedRefreshToken) throw new Error("No refresh token available");

      const response = await axios.post(
        "https://lmsbackend-six.vercel.app/api/auth/refresh",
        {
          refreshToken: storedRefreshToken,
        }
      );
      const { token: newToken, refreshToken: newRefreshToken } = response.data;

      localStorage.setItem("token", newToken);
      if (newRefreshToken)
        localStorage.setItem("refreshToken", newRefreshToken);
      setToken(newToken);
      setRefreshToken(newRefreshToken || storedRefreshToken);
      setError(null);

      const isValid = await verifyToken(newToken);
      if (!isValid) throw new Error("New token verification failed");
      return true;
    } catch (err) {
      console.error("Refresh token failed:", err.response?.data || err.message);
      setError(
        "Session refresh failed. Please log out and log in again if issues persist."
      );
      return false; // Don’t clear token here
    } finally {
      setLoading(false);
    }
  }, [verifyToken]);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      const isValid = await verifyToken(storedToken);
      if (!isValid) {
        await refreshAccessToken();
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [verifyToken, refreshAccessToken]);

  const login = useCallback(async (newToken, userData, newRefreshToken) => {
    if (!newToken || !userData) {
      setError("Login failed: Missing token or user data");
      setLoading(false);
      return false;
    }

    localStorage.setItem("token", newToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    setUser(userData);
    setError(null);
    setLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setError(null);
    setLoading(false);
  }, []);

  const refreshAuth = useCallback(() => {
    setLoading(true);
    return refreshAccessToken();
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
