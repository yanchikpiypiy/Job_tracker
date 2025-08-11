import React, { createContext, useState, useEffect } from "react";
import { authAPI } from './api';
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(localStorage.getItem("access_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userFetched, setUserFetched] = useState(false);

  useEffect(() => {
    const fetchUserAndApps = async () => {
      if (!authToken) {
        setLoading(false);
        return;
      }
      
      if (userFetched) return;
      
      setLoading(true);
      
      try {
        // Fetch user first
        const userResponse = await authAPI.getUser();
        setUser(userResponse.data);
        setUserFetched(true);
      } catch (error) {
        console.log("Error:", error);
        if (error.response?.status !== 401) {
            setUser(null);
          }
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndApps();
  }, [authToken, userFetched]);

  useEffect(() => {
      const handleLogout = () => {
        setAuthToken(null);
        setUser(null);
        setUserFetched(false);
      };

      window.addEventListener('auth:logout', handleLogout);
      return () => window.removeEventListener('auth:logout', handleLogout);
    }, []);
  
  async function login(credentials){
    try {
      const response = await authAPI.login(credentials)
      const { access, refresh } = response.data;
      
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      setAuthToken(access);
      setUserFetched(false); // Reset to trigger useEffect

      return response.data;
    } catch (error) {
      throw error;
    }

  }
  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAuthToken(null);
    setUser(null);
    setUserFetched(false);
  }
  return (
    <AuthContext.Provider value={{ user, authToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
