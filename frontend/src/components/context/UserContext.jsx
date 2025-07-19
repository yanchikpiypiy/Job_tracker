import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(localStorage.getItem("access_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userFetched, setUserFetched] = useState(false);
  useEffect(() => {
    if (!authToken) {
        console.log("it disappeared")
      setUser(null);
      setLoading(false);
      return;
    }
    if (userFetched) return;
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/v1/auth/users/me/", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
        setUserFetched(true);
      })
      .catch(() => {
        console.log("whatever blyat")
        setUser(null);
        setLoading(false);
      });
  }, [authToken]);



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
    <AuthContext.Provider value={{ user, authToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
