import React, { createContext, useState, useEffect, useContext } from "react";
import { applicationsAPI } from './api';
import { AuthContext } from "./UserContext";
// Create the context
export const ApplicationsContext = createContext();

// Custom hook to use the context
export const useApplications = () => {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error('useApplications must be used within ApplicationsProvider');
  }
  return context;
};

export function ApplicationsProvider({ children }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authToken} = useContext(AuthContext);
  // Fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationsAPI.getUserApplications();
      setApplications(response.data);
      console.log("Applications fetched:", response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
 // useEffect to craete applications
  useEffect(() => {
    if (authToken) {
      fetchApplications();
    }
  }, [authToken]);
  // Create application
  const createUserApplication = async (data) => {
    try {
      setError(null);
      const response = await applicationsAPI.createUserApplication(data);
      console.log(response);
      setApplications(prevApps => [...prevApps, response.data]);
      
      console.log("Application added successfully:", data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error adding application:", error);
      setError(error.message);
      throw error;
    }
  };
  

  // Update application
  const updateUserApplication = async (id, data) => {
    try {
      setError(null);
      const response = await applicationsAPI.updateUserApplication(id, data);
      console.log(response);
      setApplications(prevApps => 
        prevApps.map(app => 
          app.id === id ? { ...app, ...response.data } : app
        )
      );
      console.log("Application updated successfully:", data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error updating application:", error);
      setError(error.message);
      throw error;
    }
  };

  // Delete application
  const deleteUserApplication = async (applicationId) => {
    try {
      setError(null);
      await applicationsAPI.deleteUserApplication(applicationId);
      
      // Update local state by removing the deleted application
      setApplications(prevApps => 
        prevApps.filter(app => app.id !== applicationId)
      );
      
      console.log("Application deleted successfully:", applicationId);
      return { success: true };
    } catch (error) {
      console.error("Error deleting application:", error);
      setError(error.message);
      throw error;
    }
  };

  // Clear applications (useful for logout)
  const clearApplications = () => {
    setApplications([]);
    setError(null);
  };

  // Listen for logout events to clear applications
  useEffect(() => {
    const handleLogout = () => {
      clearApplications();
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // Provide context value
  const contextValue = {
    applications,
    loading,
    error,
    fetchApplications,
    createUserApplication,
    updateUserApplication,
    deleteUserApplication,
    clearApplications
  };

  return (
    <ApplicationsContext.Provider value={contextValue}>
      {children}
    </ApplicationsContext.Provider>
  );
}