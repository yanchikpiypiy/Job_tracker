// contexts/MeetingsContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { meetingsApi } from "./api";
import { useAuth } from './AuthContext';

const MeetingsContext = createContext();

export const useMeetings = () => useContext(MeetingsContext);

export function MeetingsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [meetings, setMeetings] = useState([]);
  
  // Meeting CRUD operations here
    useEffect( () => {
        
    })
    const getMeetings =  async () => {
      try{
          const response = await meetingsApi.getUserMeetings();
          console.log("meetings", Object.keys(response.data))
      }catch(error){
          console.error("Error deleting application:", error);
          setError(error.message);
      }
    }
  
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