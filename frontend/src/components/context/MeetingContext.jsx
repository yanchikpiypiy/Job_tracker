// contexts/MeetingsContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { applicationsAPI } from "./api";
import { useAuth } from './AuthContext';

const MeetingsContext = createContext();

export const useMeetings = () => useContext(MeetingsContext);

export function MeetingsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [meetings, setMeetings] = useState([]);
  
  // Meeting CRUD operations here
  
  return (
    <MeetingsContext.Provider value={{
      meetings,
      createMeeting,
      updateMeeting,
      deleteMeeting
    }}>
      {children}
    </MeetingsContext.Provider>
  );
}