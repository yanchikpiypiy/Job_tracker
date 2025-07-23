import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(localStorage.getItem("access_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userFetched, setUserFetched] = useState(false);
  const [applications,setApplications] = useState([]);
  
  useEffect(() => {
  const fetchUserAndApps = async () => {
    if (!authToken) {
      console.log("it disappeared");
      setUser(null);
      setLoading(false);
      return;
    }
    
    if (userFetched) return;
    
    setLoading(true);
    
    try {
      // Fetch user first
      const userResponse = await fetch("http://127.0.0.1:8000/api/v1/auth/users/me/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (!userResponse.ok) throw new Error("Failed to fetch user");
      
      const userData = await userResponse.json();
      setUser(userData);
      setUserFetched(true);
      
      // Then fetch applications
      const appsResponse = await fetch(`http://127.0.0.1:8000/api/v1/applications/`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      if (appsResponse.ok) {
        const apps = await appsResponse.json();
        setApplications(apps);
        console.log("Applications fetched:", apps);
      }
      
    } catch (error) {
      console.log("Error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  fetchUserAndApps();
}, [authToken, userFetched]);


  function login(token) {
    localStorage.setItem("access_token", token);
    setAuthToken(token);
  }

  function logout() {
    localStorage.removeItem("access_token");
    setAuthToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, authToken, login, logout, loading, applications }}>
      {children}
    </AuthContext.Provider>
  );
}
